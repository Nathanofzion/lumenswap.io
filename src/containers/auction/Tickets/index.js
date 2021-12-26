import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import TableDropDown from 'components/TableDropDown';
import CTable from 'components/CTable';

import moment from 'moment';
import useIsLogged from 'hooks/useIsLogged';
import { useRouter } from 'next/router';
import urlMaker from 'helpers/urlMaker';
import { getAuctionWinners } from 'api/auction';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOfferAPI } from 'api/stellar';
import { getAssetDetails } from 'helpers/asset';
import BN from 'helpers/BN';
import XLM from 'tokens/XLM';
import humanAmount from 'helpers/humanAmount';
import generateManageBuyTRX from 'stellar-trx/generateManageBuyTRX';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import { closeModalAction } from 'actions/modal';
import styles from './styles.module.scss';
import AuctionHeader from '../AuctionHeader';

const AuctionTickets = ({ auctions }) => {
  const userAddress = useSelector((state) => state.user.detail.address);
  const dispatch = useDispatch();

  const [dropdownItems, setDropDownItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tickets, setTickets] = useState(null);
  const isLogged = useIsLogged();
  const router = useRouter();

  function fetchData() {
    setTickets(null);
    let myTickets = [];
    if (selectedItem && userAddress) {
      getAuctionWinners(selectedItem?.value, { address: userAddress }).then((res) => {
        myTickets = res.data.map((ticket) => ({
          ...ticket,
          settled: true,
        }));
      });

      fetchOfferAPI(
        getAssetDetails(
          { code: selectedItem.assetCode, issuer: selectedItem.assetIssuer },
        ), getAssetDetails(XLM),
        { order: 'desc', limit: 200, seller: userAddress },
      )
        .then((data) => {
          const offers = data.data._embedded.records;
          const theBids = offers
            .filter((offer) => new BN(1)
              .div(offer.price)
              .isGreaterThanOrEqualTo(selectedItem.basePrice));

          const myBids = theBids.map((offer) => ({
            id: offer.id,
            price: new BN(1).div(offer.price).toFixed(7),
            amount: new BN(offer.amount).times(offer.price).toFixed(7),
            total: new BN(offer.amount).toString(),
            bidDate: offer.last_modified_time,
          }));

          myTickets = [...myTickets, ...myBids];
          myTickets.sort((a, b) => new Date(b.bidDate) - new Date(a.bidDate));
          setTickets(myTickets);
        })
        .catch((err) => console.log(err));
    }
  }

  function handleCancelOffer(data) {
    function func() {
      return generateManageBuyTRX(
        userAddress,
        getAssetDetails({ code: selectedItem.assetCode, issuer: selectedItem.assetIssuer }),
        getAssetDetails(XLM),
        0,
        data.price,
        data.id,
      );
    }

    showGenerateTrx(func, dispatch)
      .then((trx) => showSignResponse(trx, dispatch))
      .catch(console.log)
      .then(fetchData);
    dispatch(closeModalAction());
  }

  useEffect(() => {
    const mappedAuctions = auctions.map((auction) => ({
      value: auction.id,
      assetCode: auction.assetCode,
      assetIssuer: auction.assetIssuer,
      basePrice: auction.basePrice,
      text: `${auction.title}(${auction.assetCode})`,
    }));

    setDropDownItems(mappedAuctions);
    setSelectedItem(mappedAuctions[0]);
  }, []);

  const Container = ({ children }) => (
    <div className="container-fluid">
      <Head>
        <title>Auction Bids | Lumenswap</title>
      </Head>
      <AuctionHeader />
      {children}
    </div>
  );

  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 3,
      render: (data) => <span>{humanAmount(data.amount)} {selectedItem.assetCode}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 4,
      render: (data) => <span>{humanAmount(data.price)} XLM</span>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 5,
      render: (data) => <span>{humanAmount(data.total)} XLM</span>,
    },
    {
      title: 'Date',
      dataIndex: 'data',
      key: 2,
      render: (data) => (
        <span>
          {moment(data.bidDate).fromNow()}
        </span>
      ),
    },
    {
      title: 'Auction',
      dataIndex: 'auction',
      key: 2,
      render: (data) => {
        if (data.settled) {
          return (
            <div className={styles['status-settled']}>
              Settled
            </div>
          );
        }
        return <div onClick={() => handleCancelOffer(data)} className={styles['status-cancel']}>Cancel</div>;
      }
      ,
    },
  ];
  useEffect(() => {
    if (!isLogged) {
      router.push(urlMaker.auction.root());
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedItem]);

  return (
    <Container>
      <div className={classNames('layout main', styles.layout)}>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className={styles.title}>My Bids</h1>
              <TableDropDown defaultOption={dropdownItems[0]} onChange={() => {}} items={dropdownItems} placeholder="Select Auction" />
            </div>
            <div className="row">
              <div className="col-12">
                <div className={styles.card}>
                  <CTable
                    columns={columns}
                    noDataMessage="There is no bid"
                    className={styles.table}
                    dataSource={tickets}
                    loading={!tickets}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AuctionTickets;
