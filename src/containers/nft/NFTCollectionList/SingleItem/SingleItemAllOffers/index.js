import Head from 'next/head';
import classNames from 'classnames';
import Breadcrumb from 'components/BreadCrumb';
import urlMaker from 'helpers/urlMaker';
import { generateAddressURL } from 'helpers/explorerURLGenerator';
import { useState, useEffect } from 'react';
import CTable from 'components/CTable';
import minimizeAddress from 'helpers/minimizeAddress';
import moment from 'moment';
import { fetchOfferAPI } from 'api/stellar';
import { getAssetDetails } from 'helpers/asset';
import humanizeAmount from 'helpers/humanizeAmount';
import ServerSideLoading from 'components/ServerSideLoading';
import NFTHeader from 'containers/nft/NFTHeader';
import useDefaultTokens from 'hooks/useDefaultTokens';
import { extractTokenFromCode } from 'helpers/defaultTokenUtils';
import InfinitePagination from '../InfinitePagination';
import styles from './styles.module.scss';

const OFFER_FETCH_LIMIT = 20;

function fetchItemOffers(cursor, assetCode, defaultTokens) {
  return fetchOfferAPI(
    getAssetDetails({ code: assetCode, issuer: process.env.REACT_APP_LUSI_ISSUER }),
    getAssetDetails(extractTokenFromCode('NLSP', defaultTokens)),
    {
      limit: OFFER_FETCH_LIMIT,
      order: 'desc',
      cursor,
    },
  );
}

function SingleItemAllOffers({ itemData }) {
  const [nextPageToken, setNextPageToken] = useState(null);
  const [currentPagingToken, setCurrentPagingToken] = useState(null);
  const [pagingTokens, setPagingTokens] = useState([]);
  const defaultTokens = useDefaultTokens();
  const { number: itemId, assetCode: itemAssetCode } = itemData;
  const { name: itemCollectionName, slug: itemCollectionSlug } = itemData.Collection;

  const breadCrumbData = [
    {
      name: 'Collections',
      url: urlMaker.nft.collections.root(),
    },
    {
      name: itemCollectionName,
      url: urlMaker.nft.collections.singleCollection(itemCollectionSlug),
    },
    {
      name: `${itemData.Collection.itemName} #${itemId}`,
      url: urlMaker.nft.item.root(itemCollectionSlug, itemId),
    },
    {
      name: 'Offers',
    },
  ];

  const tableHeaders = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 1,
      render: (data) => (
        <span className={styles.address}>
          <a href={generateAddressURL(data.seller)} target="_blank" rel="noreferrer">{minimizeAddress(data.seller)}</a>
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 2,
      render: (data) => <span>{moment(data.last_modified_time).fromNow()}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 3,
      render: (data) => <span>{humanizeAmount(data.amount)} NLSP</span>,
    },

  ];

  const [offersData, setOffersData] = useState(null);

  const handlePrevPage = () => {
    if (pagingTokens.length > 0) {
      const prevPageToken = pagingTokens[pagingTokens.length - 1];
      fetchItemOffers(prevPageToken, itemAssetCode, defaultTokens).then(async (res) => {
        setNextPageToken(currentPagingToken);
        setCurrentPagingToken(prevPageToken);
        setPagingTokens((prev) => prev.slice(0, -1));
        setOffersData(
          res.data._embedded.records,
        );
      }).catch(() => {
        setPagingTokens([]);
        setCurrentPagingToken(null);
        setNextPageToken(null);
        setOffersData([]);
      });
    }
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      fetchItemOffers(nextPageToken, itemAssetCode, defaultTokens).then(async (res) => {
        if (res.data._embedded.records.length < 1) {
          setNextPageToken(null);
          return;
        }

        if (res.data._embedded.records.length >= OFFER_FETCH_LIMIT) {
          setNextPageToken(res
            .data._embedded
            .records[res.data._embedded.records.length - 1]
            .paging_token);
        } else {
          setNextPageToken(null);
        }
        setPagingTokens((prev) => [...prev, currentPagingToken]);

        setCurrentPagingToken(nextPageToken);
        setOffersData(
          res.data._embedded.records,
        );
      }).catch(() => {
        setPagingTokens([]);
        setCurrentPagingToken(null);
        setNextPageToken(null);
        setOffersData([]);
      });
    }
  };

  useEffect(() => {
    fetchItemOffers(null, itemAssetCode, defaultTokens).then(async (res) => {
      if (res.data._embedded.records.length >= OFFER_FETCH_LIMIT) {
        setNextPageToken(res
          .data._embedded
          .records[res.data._embedded.records.length - 1]
          .paging_token);
      }

      return res.data._embedded.records;
    }).then(async (res) => {
      setOffersData(res);
    }).catch(() => {
      setPagingTokens([]);
      setCurrentPagingToken(null);
      setNextPageToken(null);
      setOffersData([]);
    });
  }, []);

  return (
    <div className="container-fluid">
      <Head>
        <title>Item#{itemId} | All offers | Lumenswap</title>
      </Head>
      <NFTHeader />
      <ServerSideLoading>
        <div className={classNames('layout main', styles.main)}>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">
              <Breadcrumb data={breadCrumbData} className={styles.header} />
              <div className={styles['table-container']}>
                <div className={styles['table-header']}>
                  <span>Offers</span>
                </div>
                <CTable
                  columns={tableHeaders}
                  noDataMessage="There is no asset offer"
                  dataSource={offersData}
                  className={styles.table}
                  loading={!offersData}
                  rowFix={{ rowHeight: 53, rowNumbers: 20, headerRowHeight: 46 }}
                />
              </div>
              <InfinitePagination
                hasNextPage={!!nextPageToken}
                hasPreviousPage={pagingTokens.length > 0}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                className={styles.pagination}
              />
            </div>
          </div>
        </div>
      </ServerSideLoading>
    </div>
  );
}

export default SingleItemAllOffers;
