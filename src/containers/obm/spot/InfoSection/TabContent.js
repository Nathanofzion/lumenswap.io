import { useSelector } from 'react-redux';
import OrderHistory from './OrderHistory';
import TradeHistory from './TradeHistory';
import styles from '../styles.module.scss';

const TabContent = ({ tab, setOrderCounter }) => {
  const isLogged = useSelector((state) => state.user.logged);

  if (!isLogged) {
    return <div className={styles['centralize-content']}>Connect your wallet</div>;
  }

  if (tab === 'order') {
    return <OrderHistory setOrderCounter={setOrderCounter} />;
  }

  if (tab === 'trade') {
    return <TradeHistory />;
  }

  return null;
};

export default TabContent;
