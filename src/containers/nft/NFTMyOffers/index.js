import Head from 'next/head';
import Link from 'next/link';
import classNames from 'classnames';
import moment from 'moment';
import CTable from 'components/CTable';
import urlMaker from 'helpers/urlMaker';
import { useState, useEffect } from 'react';
import { fetchOffersOfAccount } from 'api/stellar';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useIsLogged from 'hooks/useIsLogged';
import { isSameAsset, getAssetDetails } from 'helpers/asset';

import generateManageBuyTRX from 'stellar-trx/generateManageBuyTRX';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import BN from 'helpers/BN';
import humanizeAmount from 'helpers/humanizeAmount';
import ServerSideLoading from 'components/ServerSideLoading';
import useDefaultTokens from 'hooks/useDefaultTokens';
import { extractTokenFromCode } from 'helpers/defaultTokenUtils';
import { getMyOffersData } from 'api/nft';
import NFTHeader from '../NFTHeader';
import styles from './styles.module.scss';

function loadOfferData(userAddress, setOrders, defaultTokens, setOfferItems) {
  const allOffers = [];
  const offerItems = [];
  fetchOffersOfAccount(userAddress, { limit: 200 }).then((data) => {
    allOffers.push(...data.data._embedded.records);
    if (data.data._embedded.records.length > 0) {
      return fetchOffersOfAccount(userAddress, {
        limit: 200,
        cursor: data.data._embedded.records[data.data._embedded.records.length - 1].paging_token,
      });
    }

    return data;
  }).then((data) => {
    allOffers.push(...data.data._embedded.records);
    const filtredOffers = allOffers
      .filter((offer) => {
        const isSellAssetItem = offer.selling.asset_issuer === process.env.REACT_APP_LUSI_ISSUER;
        const isBuyAssetItem = offer.buying.asset_issuer === process.env.REACT_APP_LUSI_ISSUER;
        const isSellAssetLSP = isSameAsset(getAssetDetails(extractTokenFromCode('NLSP', defaultTokens)), getAssetDetails({
          code: offer.selling.asset_code,
          issuer: offer.selling.asset_issuer,
          type: offer.selling.asset_type,
        }));
        const isBuyAssetLSP = isSameAsset(getAssetDetails(extractTokenFromCode('NLSP', defaultTokens)), getAssetDetails({
          code: offer.buying.asset_code,
          issuer: offer.buying.asset_issuer,
          type: offer.buying.asset_type,
        }));

        return (isSellAssetItem || isBuyAssetItem) && (isSellAssetLSP || isBuyAssetLSP);
      });

    setOrders(filtredOffers.map((offer) => {
      const isSellAssetItem = offer.selling.asset_issuer === process.env.REACT_APP_LUSI_ISSUER;
      const isBuyAssetLSP = isSameAsset(getAssetDetails(extractTokenFromCode('NLSP', defaultTokens)), getAssetDetails({
        code: offer.buying.asset_code,
        issuer: offer.buying.asset_issuer,
        type: offer.buying.asset_type,
      }));

      if (isSellAssetItem) {
        offerItems.push({
          code: offer.selling.asset_code,
          issuer: offer.selling.asset_issuer,
          offerId: offer.id,
        });
      }
      offerItems.push({
        code: offer.buying.asset_code,
        issuer: offer.buying.asset_issuer,
        offerId: offer.id,
      });

      const isSeller = offer.seller === userAddress;
      // const isBuyer = offer.buyer === userAddress;

      let type;
      if (isSellAssetItem && isBuyAssetLSP) {
        if (isSeller) {
          type = 'Sell';
        } else {
          type = 'Buy';
        }
      } else if (isSeller) {
        type = 'Buy';
      } else {
        type = 'Sell';
      }

      let amount;
      if (isBuyAssetLSP) {
        amount = new BN(offer.price).div(10 ** 7).toFixed(7);
      } else {
        amount = offer.amount;
      }

      return {
        id: offer.id,
        time: offer.last_modified_time,
        type,
        amount,
      };
    }));
    return offerItems;
  }).then((items) => {
    getMyOffersData(items).then((offerItemsData) => {
      setOfferItems(offerItemsData);
    });
  });
}

const NFTOrder = () => {
  const [orders, setOrders] = useState(null);
  const [offerItems, setOfferItems] = useState(null);
  const userAddress = useSelector((state) => state.user.detail.address);
  const isLogged = useIsLogged();
  const router = useRouter();
  const dispatch = useDispatch();
  const defaultTokens = useDefaultTokens();

  useEffect(() => {
    if (!isLogged) {
      router.push(urlMaker.nft.root());
    }
  }, [isLogged]);

  useEffect(() => {
    loadOfferData(userAddress, setOrders, defaultTokens, setOfferItems);
  }, []);

  const handleCancelOrder = async (offerId) => {
    function func() {
      return generateManageBuyTRX(
        userAddress,
        getAssetDetails(extractTokenFromCode('XLM', defaultTokens)),
        getAssetDetails(extractTokenFromCode('NLSP', defaultTokens)),
        '0',
        '0.1',
        offerId,
      );
    }

    await showGenerateTrx(func, dispatch)
      .then((trx) => showSignResponse(trx, dispatch))
      .catch(console.error);

    setOrders(null);
    loadOfferData(userAddress, setOrders, defaultTokens, setOfferItems);
  };
  const tableHeaders = [
    {
      title: 'Info',
      dataIndex: 'info',
      key: 1,
      render: (data) => (
        <div className={styles['type-clmn']}>
          <span>{data.type} </span>
          <Link href={urlMaker.nft.item.root(offerItems ? offerItems[data.id].slug : null,
            offerItems ? offerItems[data.id].number : null)}
          ><a>{offerItems ? `${offerItems[data.id].itemName}#${offerItems[data.id].number}` : ''}</a>
          </Link>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 2,
      render: (data) => (
        <div>
          {moment(data.time).fromNow()}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 3,
      render: (data) => (
        <div>
          {humanizeAmount(data.amount)} NLSP
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 4,
      render: (data) => (
        <div
          className={styles['cancel-btn']}
          onClick={() => handleCancelOrder(data.id)}
        >Cancel
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <Head>
        <title>My offers | Lumenswap</title>
      </Head>
      <NFTHeader />
      <ServerSideLoading>
        <div className={classNames('layout main', styles.main)}>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">
              <h1 className={styles.title}>My Offers</h1>
              <div className={styles['table-container']}>
                <CTable
                  className={styles.table}
                  columns={tableHeaders}
                  dataSource={orders}
                  noDataMessage="You have no offers"
                  loading={!orders || !offerItems}
                />
              </div>
            </div>
          </div>
        </div>
      </ServerSideLoading>
    </div>
  );
};

export default NFTOrder;
