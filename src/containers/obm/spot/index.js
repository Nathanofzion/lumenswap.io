import { useState, useEffect } from 'react';
import Error from 'containers/404';
import classNames from 'classnames';
import ObmHeader from 'containers/obm/ObmHeader';
import { getAssetDetails, getSingleToken } from 'helpers/asset';
import DetailList from 'containers/obm/spot/DetailList';
import InfoSection from 'containers/obm/spot/InfoSection';
import CTabs from 'components/CTabs';
import OrderSection from 'containers/obm/spot/OrderSection';
import TradeSection from 'containers/obm/spot/TradeSection';
import OrderFormSection from 'containers/obm/spot/OrderFormSection';
import OpenDialogElement from 'containers/obm/spot/OpenDialogElement';
import SpotHead from 'containers/obm/spot/SpotHead';
import useBreakPoint from 'hooks/useMyBreakpoint';
import { addCustomPairAction } from 'actions/userCustomPairs';
import { useDispatch, useSelector } from 'react-redux';
import { extractTokenFromCode } from 'helpers/defaultTokenUtils';
import ServerSideLoading from 'components/ServerSideLoading';
import useDefaultTokens from 'hooks/useDefaultTokens';
import ChartTab from './ChartTab';
import styles from './styles.module.scss';

function getInitialPair(pair, defaultTokens) {
  if (pair) {
    return {
      base: pair.base.issuer
        ? getAssetDetails(pair.base)
        : getAssetDetails(extractTokenFromCode(pair.base.code, defaultTokens)),
      counter: pair.counter.issuer
        ? getAssetDetails(pair.counter)
        : getAssetDetails(extractTokenFromCode(pair.counter.code, defaultTokens)),
    };
  }
  return { base: getSingleToken('XLM', defaultTokens), counter: getSingleToken('USDC', defaultTokens) };
}

const Spot = ({
  tokens, custom, errorCode, createdDefaultPairsFromServer,
}) => {
  const dispatch = useDispatch();
  const userCustomPairs = useSelector((state) => state.userCustomPairs);
  const defaultTokens = useDefaultTokens();
  const initialAsset = getInitialPair(custom, defaultTokens);

  const [appSpotPair, setAppSpotPair] = useState(initialAsset);

  const [price, setPrice] = useState(null);

  const { deviceSize } = useBreakPoint();
  const createdDefaultPairs = createdDefaultPairsFromServer.createdDefaultPairs.map((pair) => ({
    base: getAssetDetails(pair.base),
    counter: getAssetDetails(pair.counter),
  }));

  const tabs = [
    { title: 'TradingView', id: 'tvChart' },
    { title: 'Depth', id: 'depthChart' },
  ];

  useEffect(() => {
    if (tokens) {
      setAppSpotPair({
        base: getAssetDetails(tokens.from),
        counter: getAssetDetails(tokens.to),
      });
    }
  }, [tokens]);

  useEffect(() => {
    async function check() {
      if (custom) {
        let base = getAssetDetails({
          code: custom.base.code,
          issuer: custom.base.issuer,
        });

        if (custom.base.isDefault) {
          base = getAssetDetails(extractTokenFromCode(custom.base.code, defaultTokens));
        }

        let counter = getAssetDetails({
          code: custom.counter.code,
          issuer: custom.counter.issuer,
        });

        if (custom.counter.isDefault) {
          counter = getAssetDetails(extractTokenFromCode(custom.counter.code, defaultTokens));
        }

        setAppSpotPair({
          base: getAssetDetails(base),
          counter: getAssetDetails(counter),
        });

        const defaultFoundPair = createdDefaultPairs.find(
          (pair) => pair.base.code === base.code
            && pair.counter.code === counter.code
            && pair.base.issuer === base.issuer
            && pair.counter.issuer === counter.issuer,
        );

        if (!defaultFoundPair) {
          const found = userCustomPairs.find(
            (pair) => pair.base.code === base.code
              && pair.counter.code === counter.code
              && pair.base.issuer === base.issuer
              && pair.counter.issuer === counter.issuer,
          );
          if (!found) {
            dispatch(
              addCustomPairAction({
                base: getAssetDetails(base),
                counter: getAssetDetails(counter),
              }),
            );
          }
        }
      }
    }
    check();
  }, [custom]);

  if (errorCode === 404) {
    return <Error />;
  }

  return (
    <div className="container-fluid">
      <SpotHead
        custom={custom}
        tokens={tokens}
        price={price}
        setPrice={setPrice}
      />
      <ObmHeader />
      <ServerSideLoading>
        <div className="layout mt-4 other">
          {/* top section */}
          <div className={classNames('row', styles.row)}>
            {!deviceSize.md && !deviceSize.sm && !deviceSize.mobile && (
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 c-col d-lg-inline d-md-none d-sm-none d-none">
              <div className={classNames(styles.card, styles['card-select'])}>
                <OpenDialogElement
                  className="w-100"
                  appSpotPair={appSpotPair}
                  setAppSpotPair={setAppSpotPair}
                  createdDefaultPairs={createdDefaultPairs}
                />
              </div>
            </div>
            )}

            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12 c-col">
              <div className={classNames(styles.card, styles['card-detail'])}>
                {!deviceSize.xl && !deviceSize.lg ? (
                  <div>
                    <OpenDialogElement
                      className="pl-0"
                      appSpotPair={appSpotPair}
                      setAppSpotPair={setAppSpotPair}
                    />
                  </div>
                ) : (
                  ''
                )}

                <DetailList appSpotPair={appSpotPair} price={price} />
              </div>
            </div>
          </div>
          <div className={classNames('row', styles.row)}>
            {/* order section */}
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 order-xl-1 order-lg-2 order-sm-2 order-2 c-col">
              <div
                className={classNames(
                  styles.card,
                  styles['card-left'],
                  'invisible-scroll',
                )}
              >
                <OrderSection
                  price={price}
                  setPrice={setPrice}
                  appSpotPair={appSpotPair}
                />
              </div>
            </div>
            {/* middle section */}
            <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 order-xl-2 order-lg-1 order-md-1 order-sm-1 order-1 c-col">
              <div
                className={classNames(styles.card, styles['card-chart'], 'mb-1')}
              >
                <div>
                  <CTabs
                    tabs={tabs}
                    tabContent={ChartTab}
                    customTabProps={{ appSpotPair }}
                    minimal
                  />
                </div>
              </div>
              <div
                className={classNames(styles.card, styles['card-input'])}
                style={{ height: 'unset' }}
              >
                <OrderFormSection appSpotPair={appSpotPair} />
              </div>
            </div>
            {/* trade section */}
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 order-3 c-col">
              <div
                className={classNames(
                  styles.card,
                  styles['card-right'],
                  'invisible-scroll',
                )}
              >
                <TradeSection appSpotPair={appSpotPair} />
              </div>
            </div>
          </div>
          {/* end section */}
          <div className={classNames('row', styles.row)}>
            <div className="col-12 c-col mb-5">
              <div className={classNames(styles.card, styles['card-table'])}>
                <InfoSection />
              </div>
            </div>
          </div>
        </div>
      </ServerSideLoading>
    </div>
  );
};

export default Spot;
