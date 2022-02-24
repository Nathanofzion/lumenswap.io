import moment from 'moment';
import minimizeAddress from 'helpers/minimizeAddress';
import { generateTransactionURL } from 'helpers/explorerURLGenerator';
import classNames from 'classnames';
import BN from 'helpers/BN';
import styles from './styles.module.scss';

export default [
  {
    title: 'Name',
    dataIndex: 'lusiName',
    key: '1',
    render: (data) => `Lusi#${data.Lusi.number}`,
  },
  {
    title: 'Seller',
    dataIndex: 'seller',
    key: '2',
    render: (data) => (
      <a
        style={{ textDecoration: 'none' }}
        href={generateTransactionURL(data.sellerAddress)}
        target="_blank"
        rel="noreferrer"
        className={classNames(styles['link-blue'], 'd-flex w-100 align-items-center')}
      >
        {minimizeAddress(data.sellerAddress, 8)}
      </a>
    ),
  },
  {
    title: 'Buyer',
    dataIndex: 'buyer',
    key: '3',
    render: (data) => (
      <a
        style={{ textDecoration: 'none' }}
        href={generateTransactionURL(data.buyerAddress)}
        target="_blank"
        rel="noreferrer"
        className={classNames(styles['link-blue'], 'd-flex w-100 align-items-center')}
      >
        {minimizeAddress(data.buyerAddress, 8)}
      </a>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: '4',
    render: (data) => `${new BN(data.tradeAmount).div(10 ** 7).toFixed(4)} NLSP`,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: '5',
    render: (data) => moment(data).utc().fromNow(),
  },
];
