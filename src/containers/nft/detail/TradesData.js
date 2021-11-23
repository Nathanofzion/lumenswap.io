import CTable from 'components/CTable';
import minimizeAddress from 'helpers/minimizeAddress';
import { useState, useEffect } from 'react';
import { generateAddressURL } from 'helpers/explorerURLGenerator';
import { fetchTradeAPI } from 'api/stellar';
import getAssetDetails from 'helpers/getAssetDetails';
import LSP from 'tokens/LSP';
import humanAmount from 'helpers/humanAmount';
import LoadingWithContainer from '../../../components/LoadingWithContainer/LoadingWithContainer';
import styles from './styles.module.scss';

const NoDataMessage = () => (
  <div className={styles['no-data-container']}>
    <span>There is no asset trade</span>
  </div>
);

const tableHeaders = [
  {
    title: 'Buyer',
    dataIndex: 'buyer',
    key: 1,
    render: (data) => (
      <span className={styles.address}>
        <a href={generateAddressURL(data.base_account)} target="_blank" rel="noreferrer">{minimizeAddress(data.base_account)}</a>
      </span>
    ),
  },
  {
    title: 'Seller',
    dataIndex: 'seller',
    key: 2,
    render: (data) => (
      <span className={styles.address}>
        <a href={generateAddressURL(data.counter_account)} target="_blank" rel="noreferrer">{minimizeAddress(data.counter_account)}</a>
      </span>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 3,
    render: (data) => <span>{humanAmount(data.counter_amount)} LSP</span>,
  },
];

function TradesData({ lusiData }) {
  const [tradesData, setTradesData] = useState(null);

  useEffect(() => {
    fetchTradeAPI(
      getAssetDetails({ code: lusiData.assetCode, issuer: process.env.REACT_APP_LUSI_ISSUER }),
      getAssetDetails(LSP), {
        limit: 10,
        order: 'desc',
      },
    )
      .then((res) => {
        console.log(res.data._embedded.records);
        setTradesData(res.data._embedded.records);
      })
      .catch(() => {
        setTradesData([]);
      });
  }, []);
  return (
    <div>
      <CTable
        columns={tableHeaders}
        noDataMessage={NoDataMessage}
        dataSource={tradesData}
        className={styles.table}
        loading={!tradesData}
        customLoading={LoadingWithContainer}
      />
    </div>
  );
}

export default TradesData;
