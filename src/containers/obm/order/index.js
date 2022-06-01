import ObmHeader from 'containers/obm/ObmHeader';
import Head from 'next/head';
import LoginRequired from 'components/LoginRequired';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import generateBulkCancelOrderTRX from 'stellar-trx/generateBulkCancelOrderTRX';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import orderConnectIcon from 'assets/images/orderNotConnected.png';
import orderConnectIconDark from 'assets/images/order-login-dark.png';
import ServerSideLoading from 'components/ServerSideLoading';
import useCurrentTheme from 'hooks/useCurrentTheme';
import OrderData from './OrderData';
import styles from './styles.module.scss';

function OrderPage() {
  const [openOrderList, setOpenOrderList] = useState(null);
  const isLogged = useSelector((state) => state.user.logged);
  const [showCancel, setShowCancel] = useState(true);
  const userAddress = useSelector((state) => state.user.detail.address);
  const dispatch = useDispatch();
  const currentTheme = useCurrentTheme();

  async function cancelAllOrders() {
    function func() {
      return generateBulkCancelOrderTRX(
        userAddress,
        openOrderList.slice(0, 100).map((i) => ({
          buying: i.counterAsset,
          selling: i.baseAsset,
          price: i.price,
          offerId: i.id,
        })),
      );
    }

    showGenerateTrx(func, dispatch)
      .then((trx) => showSignResponse(trx, dispatch))
      .then(() => {
        setOpenOrderList(null);
      })
      .catch(console.error);
  }

  return (
    <>
      <div className="container-fluid">
        <Head>
          <title>Order | Lumenswap</title>
        </Head>
        <ObmHeader />
      </div>
      <ServerSideLoading>
        <div className={styles.main}>
          <div className={styles.title}>
            <h1 className={styles.order}>Order</h1>
            {isLogged && showCancel && openOrderList?.length > 0 && (
            <span
              className={styles['cancel-btn']}
              onClick={cancelAllOrders}
            >
              Cancel all open orders
            </span>
            )}
          </div>
          {isLogged ? (
            <OrderData
              setShowCancel={setShowCancel}
              openOrderList={openOrderList}
              setOpenOrderList={setOpenOrderList}
            />
          )
            : (
              <LoginRequired
                text="To see the orders and trades, please connect your account"
                logo={currentTheme === 'light' ? orderConnectIcon : orderConnectIconDark}
              />
            )}
        </div>
      </ServerSideLoading>
    </>
  );
}

export default OrderPage;
