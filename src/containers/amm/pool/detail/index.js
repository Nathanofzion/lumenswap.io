import Head from 'next/head';
import classNames from 'classnames';
import defaultTokens from 'tokens/defaultTokens';
import AMMHeader from 'components/AMMHeader';
import Breadcrumb from 'components/BreadCrumb';
import CurrencyPair from 'components/CurrencyPair';
import numeral from 'numeral';
import CStatistics from 'components/CStatistics';
import moment from 'moment';
import CTable from 'components/CTable';
import minimizeAddress from 'helpers/minimizeAddress';
import { generateOperationIdURL } from 'helpers/explorerURLGenerator';
import Image from 'next/image';
import getAssetDetails from 'helpers/getAssetDetails';
import isSameAsset from 'helpers/isSameAsset';
import { useDispatch, useSelector } from 'react-redux';
import WithdrawLiquidity from 'containers/amm/WithdrawLiquidity';
import { openConnectModal, openModalAction } from 'actions/modal';
import Button from 'components/Button';
import getAssetFromLPAsset from 'helpers/getCodeFromLPAsset';
import { useEffect, useState } from 'react';
import useIsLogged from 'hooks/useIsLogged';
import { fetchAccountDetails } from 'api/stellar';
import humanAmount from 'helpers/humanAmount';
import BN from 'helpers/BN';
import { getPoolDetailsById, getPoolOperationsAPI } from 'api/stellarPool';
import DepositLiquidity from 'containers/amm/DepositLiquidity';
import { getTVLInUSD } from 'helpers/stellarPool';
import sevenDigit from 'helpers/sevenDigit';
import urlMaker from 'helpers/urlMaker';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import generateRemovePoolTrustlineTRX from 'stellar-trx/generateRemovePoolTrustlineTRX';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import questionLogo from '../../../../../public/images/question.png';
import iconRefresh from '../../../../../public/images/icon-refresh.png';
import secondStyles from '../../../../components/Button/styles.module.scss';

const NoDataMessage = () => (
  <div className={styles['no-data-message-container']}>
    <span>There is no activity</span>
  </div>
);

const ShareInfo = ({ poolDetail, isLogged, userShare }) => {
  const [isUSDTVL, setIsUSDTVL] = useState(true);

  const ShareInfoContainer = ({ children }) => (
    <span className={styles['pool-info-content']}>
      {children}
    </span>
  );

  if (!isLogged) {
    return (
      <ShareInfoContainer>
        -
      </ShareInfoContainer>
    );
  }

  if (userShare === null) {
    return (
      <ShareInfoContainer>
        -
      </ShareInfoContainer>
    );
  }

  if (new BN(userShare).eq(0)) {
    return (
      <ShareInfoContainer>
        -
      </ShareInfoContainer>
    );
  }

  const shareA = new BN(userShare)
    .times(poolDetail.reserves[0].amount)
    .div(poolDetail.total_shares);
  const shareB = new BN(userShare)
    .times(poolDetail.reserves[1].amount)
    .div(poolDetail.total_shares);

  if (isUSDTVL) {
    return (
      <div className={styles['pool-info-container']}>
        <span className={styles['pool-info-content']}>
          %{sevenDigit(new BN(userShare).times(100).div(poolDetail.total_shares).toFixed(4))}
        </span>
        <div className={styles['refresh-logo']} onClick={() => setIsUSDTVL((prev) => !prev)}>
          <Image src={iconRefresh} width={18} height={18} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles['pool-info-container']}>
      <span className={styles['pool-info-content']}>
        {humanAmount(shareA.toFixed(7), true)} {getAssetFromLPAsset(poolDetail.reserves[0].asset).getCode()}{' / '}
        {humanAmount(shareB.toFixed(7), true)}{' '}
        {getAssetFromLPAsset(poolDetail.reserves[1].asset).getCode()}
      </span>
      <div className={styles['refresh-logo']} onClick={() => setIsUSDTVL((prev) => !prev)}>
        <Image src={iconRefresh} width={18} height={18} />
      </div>
    </div>
  );
};

async function loadUserPool(setUserShare, isLogged, userAddress, poolId) {
  if (isLogged) {
    try {
      const userData = await fetchAccountDetails(userAddress);
      for (const balance of userData.balances) {
        if (balance.asset_type === 'liquidity_pool_shares' && balance.liquidity_pool_id === poolId) {
          setUserShare(balance.balance);
          break;
        }
      }
    // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

async function reloadPoolDetail(setPoolDetail, poolId, router) {
  try {
    const poolDetail = await getPoolDetailsById(poolId);
    setPoolDetail(poolDetail);
  } catch (e) {
    router.push(urlMaker.pool.root());
  }
}

const Details = ({ poolDetail: initPoolDetail }) => {
  const [userShare, setUserShare] = useState(null);
  const isLogged = useIsLogged();
  const userAddress = useSelector((state) => state.user.detail.address);
  const dispatch = useDispatch();
  const [poolDetail, setPoolDetail] = useState(initPoolDetail);
  const refinedA = getAssetFromLPAsset(poolDetail.reserves[0].asset);
  const refinedB = getAssetFromLPAsset(poolDetail.reserves[1].asset);
  const [poolOperations, setPoolOperations] = useState(null);
  const router = useRouter();

  const tokenA = defaultTokens.find((token) => isSameAsset(getAssetDetails(token), refinedA));
  const tokenB = defaultTokens.find((token) => isSameAsset(getAssetDetails(token), refinedB));
  const grid2 = 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12';

  useEffect(() => {
    loadUserPool(setUserShare, isLogged, userAddress, poolDetail.id);
  }, [isLogged, userAddress]);

  useEffect(() => {
    async function loadData() {
      const operations = await getPoolOperationsAPI(poolDetail.id, { order: 'desc', limit: 20 });
      setPoolOperations(operations);
    }

    loadData();
  }, []);

  const TVLInfo = () => {
    const [isUSDTVL, setIsUSDTVL] = useState(true);
    const xlmPrice = useSelector((state) => state.xlmPrice);

    const usdTvl = getTVLInUSD(poolDetail.reserves, xlmPrice);

    if (isUSDTVL) {
      return (
        <div className={styles['pool-info-container']}>
          <span className={styles['pool-info-content']}>
            {usdTvl !== '-' && '$'}{usdTvl}
          </span>
          <div className={styles['refresh-logo']} onClick={() => setIsUSDTVL((prev) => !prev)}>
            <Image src={iconRefresh} width={18} height={18} />
          </div>
        </div>
      );
    }

    return (
      <div className={styles['pool-info-container']}>
        <span className={styles['pool-info-content']}>
          {humanAmount(poolDetail.reserves[0].amount, true)} <span className={styles['pool-info-code']}>{refinedA.code}</span>
        </span>
        <div className={styles.dot} />
        <span className={styles['pool-info-content']}>
          {humanAmount(poolDetail.reserves[1].amount, true)} <span className={styles['pool-info-code']}>{refinedB.code}</span>
        </span>
        <div className={styles['refresh-logo']} onClick={() => setIsUSDTVL((prev) => !prev)}>
          <Image src={iconRefresh} width={18} height={18} />
        </div>
      </div>
    );
  };

  const TrustLineInfo = () => (
    <span className={styles['pool-info-content']}>
      {numeral(poolDetail.total_trustlines).format('0,0')}
    </span>
  );

  const infoBlocks = [
    {
      title: 'TVL',
      content: <TVLInfo />,
      tooltip: 'This shows the total amount of volume locked in this pool.',
    },
    {
      title: 'Accounts in pool',
      content: <TrustLineInfo />,
      tooltip: 'This shows the number of accounts that participated in this pool.',
    },
    {
      title: 'Your Share',
      content: <ShareInfo
        poolDetail={poolDetail}
        isLogged={isLogged}
        userShare={userShare}
      />,
      tooltip: 'This shows your share of this pool.',
    },
  ];

  const tableHeaders = [
    {
      title: 'Operation ID',
      dataIndex: 'operationId',
      key: 1,
      render: (operation) => (
        <a
          className={styles['tx-link']}
          href={generateOperationIdURL(operation.id)}
          target="_blank"
          rel="noreferrer"
        >
          {minimizeAddress(operation.id)}
        </a>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 2,
      render: (operation) => {
        let type = 'Unknown';

        if (operation.type === 'change_trust') {
          if (new BN(operation.limit).isEqualTo(0)) {
            type = 'Remove Trustline';
          } else {
            type = 'Add Trustline';
          }
        }

        if (operation.type === 'liquidity_pool_deposit') {
          type = 'Deposit';
        }

        if (operation.type === 'liquidity_pool_withdraw') {
          type = 'Withdraw';
        }

        if (operation.type === 'path_payment_strict_receive' || operation.type === 'path_payment_strict_send') {
          type = 'Swap';
        }

        return (
          <div className={styles['table-info-row']}>
            <span>{type}</span>
          </div>
        );
      },
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 3,
      render: (operation) => <span>{moment(operation.created_at).fromNow()}</span>,
    },
  ];

  const handleDeposit = () => {
    dispatch(
      openModalAction({
        modalProps: {
          title: 'Deposit Liquidity',
          className: 'main',
        },
        content: <DepositLiquidity
          tokenA={refinedA}
          tokenB={refinedB}
          afterDeposit={() => {
            loadUserPool(setUserShare, isLogged, userAddress, poolDetail.id);
            reloadPoolDetail(setPoolDetail, poolDetail.id, router);
          }}
        />,
      }),
    );
  };

  const handleWithdraw = async () => {
    if (new BN(userShare).eq(0)) {
      // eslint-disable-next-line no-inner-declarations
      function func() {
        return generateRemovePoolTrustlineTRX(
          userAddress,
          tokenA,
          tokenB,
        );
      }

      await showGenerateTrx(func, dispatch)
        .then((trx) => showSignResponse(trx, dispatch))
        .catch(console.error);

      loadUserPool(setUserShare, isLogged, userAddress, poolDetail.id);
      reloadPoolDetail(setPoolDetail, poolDetail.id, router);
    } else {
      dispatch(
        openModalAction({
          modalProps: {
            title: 'Withdraw Liquidity',
            className: 'main',
          },
          content: <WithdrawLiquidity
            tokenA={refinedA}
            tokenB={refinedB}
            afterWithdraw={() => {
              loadUserPool(setUserShare, isLogged, userAddress, poolDetail.id);
              reloadPoolDetail(setPoolDetail, poolDetail.id, router);
            }}
          />,
        }),
      );
    }
  };
  const breadCrumbData = [
    {
      name: 'Pools',
      url: urlMaker.pool.root(),
    },
    {
      render: () => (
        <div className={styles['pair-data']}>
          <CurrencyPair
            size={26}
            source={[tokenA?.logo ?? questionLogo, tokenB?.logo ?? questionLogo]}
          />
          <div className="ml-2">{refinedA.code}/{refinedB.code}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid pb-5">
      <Head>
        <title>Pool - {refinedA.getCode()}/{refinedB.getCode()} | Lumenswap</title>
      </Head>
      <AMMHeader />
      <div className={classNames('layout main', styles.main)}>
        <div className="row justify-content-center">
          <div className="col-xl-7 col-lg-11 col-md-12 col-sm-12 col-12">
            <div className="row align-items-center">
              <div className={grid2}>
                <div className={styles['header-container']}>
                  <div>
                    <Breadcrumb
                      data={breadCrumbData}
                    />
                  </div>
                  <div className={styles['btns-container']}>
                    <Button
                      className={classNames(styles['deposit-btn'], secondStyles['button-primary'])}
                      content="Deposit"
                      onClick={() => {
                        if (isLogged) {
                          handleDeposit();
                        } else {
                          dispatch(openConnectModal());
                        }
                      }}
                    />
                    {userShare !== null && isLogged && (
                    <Button
                      className={classNames(styles['withdraw-btn'], secondStyles['button-basic'])}
                      content={new BN(userShare).eq(0) ? 'Remove' : 'Withdraw'}
                      onClick={handleWithdraw}
                    />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row p">
              <div className={classNames(styles['info-pool'], 'col-12')}>
                <CStatistics className={styles['c-statistic']} blocks={infoBlocks} />
              </div>
              <div className="col-12"> <h1 className={styles.title}>Latest pool activity</h1></div>
              <div className="col-12">
                <CTable
                  columns={tableHeaders}
                  noDataMessage={NoDataMessage}
                  dataSource={poolOperations}
                  className={styles.table}
                  loading={poolOperations === null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
