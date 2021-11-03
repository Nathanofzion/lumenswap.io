import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import NFTHeader from 'components/NFTHeader';
import Button from 'components/Button';
import CTabs from 'components/CTabs';
import { openModalAction, openConnectModal } from 'actions/modal';
import { useDispatch } from 'react-redux';
import PlaceNFTOrder from 'containers/nft/PlaceNFTOrder';
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
import numeral from 'numeral';
import Breadcrumb from 'components/BreadCrumb';
import urlMaker from 'helpers/urlMaker';
import NFTDetailsTabContent from './NFTDetailsTabContent';
import styles from './styles.module.scss';

const NFTDetail = ({ id, data }) => {
  const dispatch = useDispatch();
  const isLogged = useIsLogged();
  const [tab, setTab] = useState('offer');

  const nftInfo = [
    {
      title: 'Price',
      tooltip: 'tooltip',
      render: (info) => <span className={styles.infos}>{numeral(info.price).format('0,0')} LSP</span>,
    },
    {
      title: 'Asset',
      tooltip: 'tooltip',
      externalLink: {
        title: `${data.nftInfo.asset}`,
        url: assetGenerator(data.asset.code, data.asset.issuer),
      },
    },
    {
      title: 'IPFs hash',
      tooltip: 'tooltip',
      externalLink: {
        title: `${minimizeAddress(data.nftInfo.hash)}`,
        url: ipfsHashGenerator(data.nftInfo.hash),
      },
    },
  ];
  const ownerInfo = [
    {
      title: 'Address',
      tooltip: 'tooltip',
      externalLink: {
        title: `${minimizeAddress(data.ownerInfo.address)}`,
        url: generateAddressURL(data.ownerInfo.address),
      },
    },
    {
      title: 'Twitter',
      tooltip: 'tooltip',
      externalLink: {
        title: `@${data.ownerInfo.twitter}`,
        url: twitterUrlMaker(data.ownerInfo.twitter),
      },
    },
    {
      title: 'Telegram',
      tooltip: 'tooltip',
      externalLink: {
        title: `@${data.ownerInfo.telegram}`,
        url: telegramUrlMaker(data.ownerInfo.telegram),
      },
    },
  ];

  const tabs = [
    { title: 'Offers', id: 'offer' },
    { title: 'Trades', id: 'trade' },
  ];
  const breadCrumbData = [
    {
      name: 'My lusi',
    },
    {
      name: `Lusi #${id}`,
    },
  ];

  const handlePlaceOffer = () => {
    if (isLogged) {
      dispatch(
        openModalAction({
          modalProps: { title: 'Set a price' },
          content: <PlaceNFTOrder />,
        }),
      );
    } else {
      dispatch(openConnectModal());
    }
  };
  const handleChangeTab = (tabId) => {
    setTab(tabId);
  };
  function generateLink() {
    if (tab === 'offer') {
      return urlMaker.nft.lusiOffers(id);
    }
    return urlMaker.nft.lusiTrades(id);
  }

  return (
    <div className="container-fluid">
      <Head>
        <title>NFT | Lumenswap</title>
      </Head>
      <NFTHeader />
      <div className={classNames('layout main', styles.main)}>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">

            <div className="d-flex justify-content-between align-items-center">
              <Breadcrumb data={breadCrumbData} />
              <Button
                variant="primary"
                content="Place an offer"
                fontWeight={500}
                className={styles.btn}
                onClick={handlePlaceOffer}
              />
            </div>

            <div className={classNames('row', styles.row)}>
              <div className={classNames('col-lg-6 col-md-12 col-sm-12 col-12', styles.col)}>
                <div className={classNames(styles.card, styles['card-nft'])}>
                  <div className="d-flex justify-content-center">
                    <Image src={data.lusiImage} width={342} height={342} />
                  </div>
                </div>
              </div>
              <div className={classNames('col-lg-6 col-md-12 col-sm-12 col-12', styles.col)}>
                <InfoBox
                  title="NFT Info"
                  rows={nftInfo}
                  data={data.nftInfo}
                  className={styles['first-info-box']}
                />
                <InfoBox
                  title="Owner Info"
                  rows={ownerInfo}
                  data={data.ownerInfo}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className={classNames(styles['card-2'], styles['card-tabs'])}>
                  <CTabs
                    tabs={tabs}
                    tabContent={NFTDetailsTabContent}
                    className={styles.tabs}
                    onChange={handleChangeTab}
                    customTabProps={{
                      lusiId: id,
                    }}
                  />
                </div>
                <CSeeAllContentsButton className={styles['all-btn']} link={generateLink()} content={tab === 'offer' ? 'See all offers' : 'See all trades'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
