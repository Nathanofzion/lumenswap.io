import OrderList from 'components/SpotList/OrderList';
import classNames from 'classnames';
import styles from './styles.module.scss';

export default function LeftSideAppLumen({
  asks = [], bids = [], info, headerItem,
}) {
  return (
    <>
      <OrderList
        headerItem={headerItem}
        rowItem={asks}
        isSell
      />
      <div className={styles.gap}>
        <span className={classNames(styles.total)}>{info}</span>
        {/* <span className={styles.price}>{gapInfo.price}</span> */}
      </div>
      <OrderList
        headerItem={[]}
        rowItem={bids}
        isSell={false}
      />
    </>
  );
}
