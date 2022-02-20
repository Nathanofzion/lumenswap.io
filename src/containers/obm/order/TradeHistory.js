import { fetchTradesOfAccount } from 'api/stellar';
import CTable from 'components/CTable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BN from 'helpers/BN';
import humanizeAmount from 'helpers/humanizeAmount';
import styles from './styles.module.scss';

function TradeHistory() {
  const [tradeHistoryList, setTradeHistoryList] = useState(null);
  const isLogged = useSelector((state) => state.user.logged);
  const userAddress = useSelector((state) => state.user.detail.address);

  useEffect(() => {
    function loadData() {
      fetchTradesOfAccount(userAddress, { limit: 200 }).then((res) => {
        setTradeHistoryList(res.data._embedded.records.map((item) => {
          const time = new Date(item.ledger_close_time);
          const price = new BN(item.price.n).div(item.price.d);
          const otherPrice = new BN(item.price.d).div(item.price.n);
          let sellAsset;
          let buyAsset;
          let sellAmount;
          let buyAmount;
          if (item.base_account === userAddress) {
            sellAsset = item.base_asset_code || 'XLM';
            sellAmount = humanizeAmount(item.base_amount);

            buyAsset = item.counter_asset_code || 'XLM';
            buyAmount = humanizeAmount(item.counter_amount);
          } else {
            sellAsset = item.counter_asset_code || 'XLM';
            sellAmount = humanizeAmount(item.counter_amount);

            buyAsset = item.base_asset_code || 'XLM';
            buyAmount = humanizeAmount(item.base_amount);
          }

          return {
            time,
            price: humanizeAmount(price.toFixed(7)),
            otherPrice: humanizeAmount(otherPrice.toFixed(7)),
            sellAsset,
            buyAsset,
            sellAmount,
            buyAmount,
            pair: {
              counter: item.counter_asset_code || 'XLM',
              base: item.base_asset_code || 'XLM',
            },
          };
        }));
      });
    }
    if (isLogged) {
      loadData();
    }
  }, [isLogged]);

  const tableHeaders = [
    {
      title: 'Date',
      dataIndex: 'time',
      key: '1',
      render: (data) => (
        <span>{moment(data.time).fromNow()}</span>
      ),
    },
    {
      title: 'Sold',
      dataIndex: 'sellAmount',
      key: '2',
      render: (data) => (
        <div className={styles.sold}>
          <span className={styles.amount}>{data.sellAmount}</span>
          <span>{data.sellAsset}</span>
        </div>
      ),
    },
    {
      title: 'Bought',
      dataIndex: 'buyAmount',
      key: '3',
      render: (data) => (
        <div className={styles.sold}>
          <span className={styles.amount}>{data.buyAmount}</span>
          <span>{data.buyAsset}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: '4',
      render: (data) => `${data.price} ${data.pair.counter} / ${data.otherPrice} ${data.pair.base}`,
    },

  ];

  return (
    <>
      <div style={{ marginLeft: '-24px' }}>
        <CTable
          className={styles.table}
          columns={tableHeaders}
          dataSource={tradeHistoryList}
          loading={tradeHistoryList === null}
          noDataMessage="You have no trade history"
        />
      </div>
    </>
  );
}

export default TradeHistory;
