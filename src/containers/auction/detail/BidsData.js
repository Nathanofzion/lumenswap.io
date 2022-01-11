import React, { useEffect, useState } from 'react';
import CTable from 'components/CTable';
import NoData from 'components/NoData';
import { generateAddressURL } from 'helpers/explorerURLGenerator';
import minimizeAddress from 'helpers/minimizeAddress';
import moment from 'moment';
import { fetchOfferAPI } from 'api/stellar';
import { getAssetDetails } from 'helpers/asset';
import XLM from 'tokens/XLM';
import BN from 'helpers/BN';
import humanAmount from 'helpers/humanAmount';
import { getAuctionBids } from 'api/auction';
import styles from './styles.module.scss';
import { STATUS_NAMES } from '../consts/board';

const BidsData = ({
  searchQuery, tab, assetCode, assetIssuer, basePrice, refreshData, auctionStatus, auctionId,
}) => {
  const [bids, setBids] = useState(null);

  let filteredBids = bids && [...bids];
  if (searchQuery) {
    if (tab === 'bid') {
      filteredBids = filteredBids?.filter((bid) => bid.seller.search(searchQuery) !== -1);
    }
  }
  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 1,
      render: (data) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={generateAddressURL(data.seller)}
          className={styles.link}
        >
          {minimizeAddress(data.seller)}
        </a>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'data',
      key: 2,
      render: (data) => (
        <span>
          {moment(data.last_modified_time).fromNow()}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 3,
      render: (data) => (
        <span>
          {humanAmount(new BN(data.amount)
            .times(data.price).toString())} {assetCode}
        </span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 4,
      render: (data) => (
        <span>
          {humanAmount(new BN(1).div(data.price).toFixed(7))} XLM
        </span>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 5,
      render: (data) => (
        <span>
          {humanAmount(new BN(data.amount))} XLM
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (auctionStatus === STATUS_NAMES['not-started']) {
      setBids([]);
    } else if (auctionStatus === STATUS_NAMES.ended) {
      getAuctionBids(auctionId, {}).then((data) => {
        const mappedBids = data.data.map((bid) => ({
          price: new BN(1).div(new BN(bid.price)).toFixed(7),
          amount: new BN(bid.total).div(10 ** 7).toFixed(7),
          seller: bid.address,
          last_modified_time: bid.bidDate,
        }));

        setBids(mappedBids);
      });
    } else {
      fetchOfferAPI(
        getAssetDetails(
          { code: assetCode, issuer: assetIssuer },
        ), getAssetDetails(XLM),
        { order: 'desc', limit: 200 },
      )
        .then((data) => {
          const offers = data.data._embedded.records;
          const theBids = offers.filter((offer) => new BN(1)
            .div(offer.price)
            .isGreaterThanOrEqualTo(basePrice));

          setBids(theBids.slice(0, 10));
        })
        .catch((err) => console.log(err));
    }
  }, [refreshData]);

  return (
    <CTable
      columns={columns}
      noDataComponent={() => <NoData message="There is no bid" />}
      className={styles.table}
      dataSource={filteredBids}
      loading={!bids}
      rowFix={{
        rowHeight: 53,
        rowNumbers: 10,
        headerRowHeight: 40,
      }}
    />
  );
};

export default BidsData;
