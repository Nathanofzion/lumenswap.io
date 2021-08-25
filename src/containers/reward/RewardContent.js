import CTable from 'components/CTable';
import CStatistics, { Info } from 'components/CStatistics';
import moment from 'moment';
import numeral from 'numeral';
import { generateTransactionURL } from 'helpers/explorerURLGenerator';
import minimizeAddress from 'helpers/minimizeAddress';
import Loading from 'components/Loading';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchAddressReward, fetchAddressRewardStats } from 'api/rewards';
import isSameAsset from 'helpers/isSameAsset';
import getAssetDetails from 'helpers/getAssetDetails';
import LSP from 'tokens/LSP';
import sevenDigit from 'helpers/sevenDigit';
import styles from './styles.module.scss';

const NoDataMessage = () => (
  <div className={styles.noDataMessageContainer}>
    <div className={styles.noDataMessage}>There is no reward activity here</div>
  </div>
);

const RewardContent = () => {
  const userAdress = useSelector((state) => state.user.detail.address);
  const [rewardStats, setRewardStats] = useState(null);
  const [addressReward, setAddressReward] = useState(null);
  const userBalances = useSelector((state) => state.userBalance);
  const foundLSP = userBalances
    .find((i) => isSameAsset(getAssetDetails(LSP), getAssetDetails(i.asset)));

  useEffect(() => {
    function loadingUserData() {
      fetchAddressRewardStats(userAdress)
        .then((res) => setRewardStats(res.data)).catch((err) => console.log(err));
    }

    function loadAddressReward() {
      fetchAddressReward(userAdress)
        .then((res) => setAddressReward(res.data)).catch((err) => console.log(err));
    }

    loadingUserData();
    loadAddressReward();
  }, [userAdress]);

  const tableHeaders = [
    {
      title: 'Tx',
      dataIndex: 'txHash',
      key: '1',
      render: (data) => (
        <a
          href={generateTransactionURL(data.txHash)}
          target="_blank"
          rel="noreferrer"
          style={{ color: '#0e41f5', textDecoration: 'none' }}
        >{minimizeAddress(data.txHash)}
        </a>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'txDate',
      key: '2',
      render: (data) => <span>{moment(data.txDate).fromNow()}</span>,
    },
    { title: 'Type', dataIndex: 'type', key: '3' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: '4',
      render: (data) => <span>{numeral(data.amount).format('0,0.[0000]')}</span>,
    },
  ];

  const statisticBlocks = [
    {
      title: 'Wallet balance',
      tooltip: 'tooltip ',
      content: <Info text="LSP" number={sevenDigit(foundLSP ? foundLSP.balance : '0')} />,
    },
    {
      title: 'Holder reward earned',
      tooltip: 'tooltip ',
      content: <Info text="LSP" number={rewardStats?.holder?.total} />,
    },
    {
      title: 'Trade reward earned',
      tooltip: 'tooltip ',
      content: <Info text="LSP" number={rewardStats?.trader?.total} />,
    },
  ];

  return (
    <div>
      <div className={styles['info-LSP']}>
        <CStatistics blocks={statisticBlocks} />
      </div>
      <div className={styles['table-title']}>Last activity</div>
      <div className={styles['table-container']}>
        {rewardStats === null || addressReward === null ? (
          <div className={styles['loading-container']}>
            <Loading size={48} />
          </div>
        ) : (
          <CTable
            columns={tableHeaders}
            dataSource={addressReward?.data}
            noDataMessage={NoDataMessage}
          />
        )}
      </div>
    </div>
  );
};

export default RewardContent;
