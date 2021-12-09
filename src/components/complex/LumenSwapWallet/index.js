import React from 'react';
import Head from 'next/head';
import ObmHeader from 'components/ObmHeader';
import AMMHeader from 'components/AMMHeader';
import LoginRequired from 'components/LoginRequired';
import { useSelector } from 'react-redux';
import walletNotConnectedIcon from 'assets/images/walletNotConnected.png';
import { walletTypes } from 'helpers/consts';
import WalletData from './walletData';
import styles from './styles.module.scss';

function LumenSwapWallet({ type = walletTypes.OBM }) {
  const isLogged = useSelector((state) => state.user.logged);
  return (
    <>
      <div className="container-fluid">
        <Head>
          <title>Wallet | Lumenswap</title>
        </Head>
        {type === 'obm' ? <ObmHeader /> : <AMMHeader />}
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>Wallet</h1>
        {isLogged ? <WalletData type={type} /> : (
          <LoginRequired
            logo={walletNotConnectedIcon}
            text="To see the wallet statistics, please connect your account"
          />
        )}
      </div>
    </>
  );
}

export default LumenSwapWallet;
