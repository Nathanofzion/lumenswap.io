import moment from 'moment';
import minimizeAddress from 'helpers/minimizeAddress';
import { generateAddressURL } from 'helpers/explorerURLGenerator';
import classNames from 'classnames';
import BN from 'helpers/BN';
import urlMaker from 'helpers/urlMaker';
import Link from 'next/link';
import styles from './styles.module.scss';

export default [
  {
    title: 'Name',
    dataIndex: 'lusiName',
    key: '1',
    render: (data) => (
      <Link href={urlMaker.nft.item.root(data.Nft.Collection.slug, data.Nft.number)}>
        <a className={styles.link}>
          {data.Nft.assetCode}
        </a>
      </Link>
    ),
  },
  {
    title: 'Seller',
    dataIndex: 'seller',
    key: '2',
    render: (data) => (
      <a
        style={{ textDecoration: 'none' }}
        href={generateAddressURL(data.sellerAddress || '')}
        target="_blank"
        rel="noreferrer"
        className={classNames(styles['link-blue'], 'd-flex w-100 align-items-center')}
      >
        {minimizeAddress(data.sellerAddress || '', 4)}
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
        href={generateAddressURL(data.buyerAddress || '')}
        target="_blank"
        rel="noreferrer"
        className={classNames(styles['link-blue'], 'd-flex w-100 align-items-center')}
      >
        {minimizeAddress(data.buyerAddress || '', 4)}
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
    render: (data) => moment(data.periodTime).utc().fromNow(),
  },
];
