import Head from 'next/head';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import BN from 'helpers/BN';
import Button from 'components/Button';
import BigLogo from 'assets/images/BigLogo';
import refreshIcon from 'assets/images/refresh-icon-nft.svg';
import CTabs from 'components/CTabs';
import { openModalAction, openConnectModal } from 'actions/modal';
import { useDispatch, useSelector } from 'react-redux';
import useIsLogged from 'hooks/useIsLogged';
import minimizeAddress from 'helpers/minimizeAddress';
import CSeeAllContentsButton from 'components/CSeeAllContentsButton';
import InfoBox from 'components/InfoBox';
import {
  generateAddressURL,
  twitterUrlMaker,
  telegramUrlMaker,
  assetGenerator,
  ipfsHashGenerator,
} from 'helpers/explorerURLGenerator';
import Breadcrumb from 'components/BreadCrumb';
import urlMaker from 'helpers/urlMaker';
import Submitting from 'components/Submitting';
import { isSameAsset, getAssetDetails } from 'helpers/asset';
import { fetchOfferAPI, fetchOffersOfAccount, fetchOrderBookAPI } from 'api/stellar';
import humanizeAmount from 'helpers/humanizeAmount';
import numeral from 'numeral';
import ServerSideLoading from 'components/ServerSideLoading';
import NFTHeader from 'containers/nft/NFTHeader';
import useDefaultTokens from 'hooks/useDefaultTokens';
import { extractTokenFromCode } from 'helpers/defaultTokenUtils';
import PlaceNFTOrder from './PlaceNFTOrder';
import styles from './styles.module.scss';
import SingleItemTabContent from './SingleItemTabContent';
import SetOrUpdateNFTPrice from './SetOrUpdateNFTPrice';
import getItemOwner from './getItemOwner';

function PlaceOrSetPriceButtonContent({ buttonState }) {
  if (buttonState === 'loading') {
    return <Submitting loadingSize={21} />;
  }

  if (buttonState === 'place') {
    return 'Place an offer';
  }

  if (buttonState === 'set') {
    return 'Set a price';
  }

  if (buttonState === 'update') {
    return 'Update price';
  }

  return null;
}

function loadItemOffers(data, setItemOffers, defaultTokens) {
  fetchOfferAPI(
    getAssetDetails({ code: data.assetCode, issuer: process.env.REACT_APP_LUSI_ISSUER }),
    getAssetDetails(extractTokenFromCode('NLSP', defaultTokens)),
    {
      limit: 10,
      order: 'desc',
    },
  ).then((res) => res
    .data
    ._embedded
    .records)
    .then((res) => {
      setItemOffers(res);
    });
}

function loadItemPrice(assetCode, setItemPrice, defaultTokens) {
  fetchOrderBookAPI(
    getAssetDetails({ code: assetCode, issuer: process.env.REACT_APP_LUSI_ISSUER }),
    getAssetDetails(extractTokenFromCode('NLSP', defaultTokens)),
    {
      limit: 1,
    },
  ).then((res) => {
    if (res.data.asks[0]) {
      setItemPrice(res.data.asks[0].price);
      return;
    }

    setItemPrice('0');
  }).catch((e) => {
    console.error(e);
  });
}

function loadAllRelatedDataToItem(data, setItemOffers,
  setOwnerInfoData, setItemPrice, defaultTokens) {
  setOwnerInfoData(null);
  setItemOffers(null);
  setItemPrice(null);
  loadItemOffers(data, setItemOffers, defaultTokens);
  getItemOwner(data.assetCode).then((ownerInfo) => {
    setOwnerInfoData(ownerInfo);
  });
  loadItemPrice(data.assetCode, setItemPrice, defaultTokens);
}

const NFTDetail = ({ itemData }) => {
  const dispatch = useDispatch();
  const isLogged = useIsLogged();
  const [ownerInfoData, setOwnerInfoData] = useState(null);
  const [tab, setTab] = useState('offer');
  const userBalances = useSelector((state) => state.userBalance);
  const userAddress = useSelector((state) => state.user.detail.address);
  const [buttonState, setButtonState] = useState(null);
  const [offerIdToUpdate, setOfferIdToUpdate] = useState(null);
  const [itemOffers, setItemOffers] = useState(null);
  const [showNLSP, setShowNLSP] = useState(true);
  const [itemPrice, setItemPrice] = useState(null);
  const defaultTokens = useDefaultTokens();

  useEffect(() => {
    loadAllRelatedDataToItem(itemData, setItemOffers, setOwnerInfoData, setItemPrice,
      defaultTokens);
  }, []);

  useEffect(() => {
    async function loadOfferData() {
      if (isLogged) {
        setButtonState('loading');

        const currentItem = getAssetDetails({
          code: itemData.assetCode,
          issuer: process.env.REACT_APP_LUSI_ISSUER,
        });
        let found = false;
        for (const balance of userBalances) {
          if (isSameAsset(getAssetDetails(balance.asset), currentItem)
          && new BN(balance.rawBalance).gt(0)) {
            found = true;
            break;
          }
        }

        let offerFound = null;
        if (found) {
          const userOffers = await fetchOffersOfAccount(userAddress, { limit: 200, order: 'desc' }).then((res) => res.data._embedded.records);
          for (const offer of userOffers) {
            const offerSellingAsset = getAssetDetails({
              code: offer.selling.asset_code,
              issuer: offer.selling.asset_issuer,
              type: offer.selling.asset_type,
            });
            if (isSameAsset(offerSellingAsset, currentItem)) {
              offerFound = offer.id;
              break;
            }
          }
        }

        if (offerFound !== null) {
          setOfferIdToUpdate(offerFound);
          setButtonState('update');
        } else if (found) {
          setButtonState('set');
        } else {
          setButtonState('place');
        }
      } else {
        setButtonState(null);
      }
    }

    loadOfferData();
  }, [isLogged, userAddress, JSON.stringify(userBalances)]);

  const handleSwitchBetweenPrices = () => {
    setShowNLSP((prev) => !prev);
  };

  const PriceInfo = () => {
    if (showNLSP) {
      return (
        <>
          <div className={styles.logo}><BigLogo color="#DF4886" />
          </div>{humanizeAmount(new BN(itemPrice).div(10 ** 7).toFixed(7))} NLSP
        </>
      );
    }

    return (
      <>
        <div className={styles.logo}><BigLogo color="#0e41f5" />
        </div>{numeral(humanizeAmount(new BN(itemPrice))).format('0,0')} LSP
      </>
    );
  };

  const nftInfo = [
    {
      title: 'Price',
      tooltip: '$NLSP is an LSP-backed asset minted on Stellar, and it’s used for buying and selling Lusis on Lumenswap’s NFT marketplace. 1 NLSP = 10,000,000 LSP.',
      render: () => {
        if (!new BN(itemPrice).isZero() && itemPrice !== null) {
          return (
            <span className={styles.infos}>
              <PriceInfo />
              <div className={styles['refresh-icon']}>
                <img
                  src={refreshIcon}
                  height={18}
                  width={18}
                  onClick={handleSwitchBetweenPrices}
                />
              </div>
            </span>
          );
        }

        return <span className={styles.infos}>Not set yet</span>;
      },
    },
    {
      title: 'Asset',
      externalLink: {
        title: `${itemData.assetCode}`,
        url: assetGenerator(itemData.assetCode, process.env.REACT_APP_LUSI_ISSUER),
      },
    },
    {
      title: 'IPFs hash',
      externalLink: {
        title: `${minimizeAddress(itemData.ipfHash)}`,
        url: ipfsHashGenerator(itemData.ipfHash),
      },
    },
  ];

  const ownerInfo = [
    {
      title: 'Address',
      externalLink: {
        title: ownerInfoData?.address ? `${minimizeAddress(ownerInfoData?.address)}` : '-',
        url: ownerInfoData?.address ? generateAddressURL(ownerInfoData?.address) : '-',
      },
    },
    {
      title: 'Twitter',
      render: () => (ownerInfoData?.twitter ? (
        <a
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
          className={styles['info-link']}
          href={twitterUrlMaker(Buffer.from(ownerInfoData.twitter, 'base64').toString('utf-8'))}
        >
          @{Buffer.from(ownerInfoData.twitter, 'base64').toString('utf-8')}
        </a>
      ) : <span className={styles['no-link']}>-</span>),
    },
    {
      title: 'Telegram',
      render: () => (ownerInfoData?.telegram ? (
        <a
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
          className={styles['info-link']}
          href={telegramUrlMaker(Buffer.from(ownerInfoData.telegram, 'base64').toString('utf-8'))}
        >
          @{Buffer.from(ownerInfoData.telegram, 'base64').toString('utf-8')}
        </a>
      ) : <span className={styles['no-link']}>-</span>),
    },
  ];

  const tabs = [
    { title: 'Offers', id: 'offer' },
    { title: 'Trades', id: 'trade' },
  ];

  const breadCrumbData = [
    {
      name: 'Collections',
      url: urlMaker.nft.collections.root(),
    },
    {
      name: itemData.Collection.name,
      url: urlMaker.nft.collections.singleCollection(itemData.Collection.slug),
    },
    {
      name: `${itemData.Collection.name} #${itemData.number}`,
    },
  ];

  const handlePlaceOffer = () => {
    if (isLogged) {
      if (buttonState === 'place') {
        dispatch(
          openModalAction({
            modalProps: { title: 'Place an offer' },
            content: <PlaceNFTOrder
              itemAssetCode={itemData.assetCode}
              afterPlace={() => loadAllRelatedDataToItem(itemData,
                setItemOffers, setOwnerInfoData, setItemPrice, defaultTokens)}
            />,
          }),
        );
      } else if (buttonState === 'set') {
        dispatch(
          openModalAction({
            modalProps: { title: 'Set a price' },
            content: <SetOrUpdateNFTPrice
              itemAssetCode={itemData.assetCode}
              mode={buttonState}
              offerId={offerIdToUpdate}
              afterSetPrice={() => loadAllRelatedDataToItem(itemData,
                setItemOffers, setOwnerInfoData, setItemPrice, defaultTokens)}
            />,
          }),
        );
      } else if (buttonState === 'update') {
        dispatch(
          openModalAction({
            modalProps: { title: 'Update price' },
            content: <SetOrUpdateNFTPrice
              itemAssetCode={itemData.assetCode}
              mode={buttonState}
              offerId={offerIdToUpdate}
              afterSetPrice={() => loadAllRelatedDataToItem(itemData,
                setItemOffers, setOwnerInfoData, setItemPrice, defaultTokens)}
            />,
          }),
        );
      }
    } else {
      dispatch(openConnectModal());
    }
  };

  const handleChangeTab = (tabId) => {
    setTab(tabId);
    if (tabId === 'offer') {
      setItemOffers(null);
      loadItemOffers(itemData, setItemOffers, defaultTokens);
    }
  };

  function generateLink() {
    if (tab === 'offer') {
      return urlMaker.nft.item.offers(itemData.Collection.slug, itemData.number);
    }

    return urlMaker.nft.item.trades(itemData.Collection.slug, itemData.number);
  }

  return (
    <div className="container-fluid">
      <Head>
        <title>{itemData.Collection.name} #{itemData.number} | Lumenswap</title>
      </Head>
      <NFTHeader />
      <ServerSideLoading>
        <div className={classNames('layout main', styles.main)}>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">

              <div className="d-flex justify-content-between align-items-center">
                <Breadcrumb className={styles.bread} data={breadCrumbData} />
                {buttonState !== null && (
                <Button
                  variant="primary"
                  fontWeight={500}
                  className={styles.btn}
                  onClick={handlePlaceOffer}
                  disabled={buttonState === 'loading'}
                >
                  <PlaceOrSetPriceButtonContent buttonState={buttonState} />
                </Button>
                )}
              </div>

              <div className={classNames('row', styles.row)}>
                <div className={classNames('col-lg-6 col-md-6 col-sm-12 col-12', styles.col)}>
                  <div className={classNames(styles.card, styles['card-nft'])}>
                    <div className={classNames('d-flex justify-content-center', styles['img-container'])}>
                      <img
                        loading="lazy"
                        src={itemData.imageUrl}
                        className={styles['lusi-img']}
                      />
                    </div>
                  </div>
                </div>
                <div className={classNames('col-lg-6 col-md-6 col-sm-12 col-12', styles.col)}>
                  <InfoBox
                    title="NFT Info"
                    rows={nftInfo}
                    data={itemData}
                    className={styles['first-info-box']}
                  />
                  <InfoBox
                    title="Owner Info"
                    rows={ownerInfo}
                    data={ownerInfoData}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className={classNames(styles['card-2'], styles['card-tabs'])}>
                    <CTabs
                      tabs={tabs}
                      tabContent={SingleItemTabContent}
                      className={styles.tabs}
                      onChange={handleChangeTab}
                      customTabProps={{
                        itemData,
                        offers: itemOffers,
                      }}
                    />
                  </div>
                  <CSeeAllContentsButton
                    className={styles['all-btn']}
                    link={generateLink()}
                    content={tab === 'offer' ? 'See all offers' : 'See all trades'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ServerSideLoading>
    </div>
  );
};

export default NFTDetail;
