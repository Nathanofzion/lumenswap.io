import React from 'react';
import AMMCurrentPrice from 'containers/amm/mypool/AMMCurrentPrice';
import Button from 'components/Button';
import { getAssetDetails, extractLogoByToken } from 'helpers/asset';
import humanizeAmount from 'helpers/humanizeAmount';
import BN from 'helpers/BN';
import { initializeStore } from 'store';
import generateWithdrawPoolTRX from 'stellar-trx/generateWithdrawPoolTRX';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import styles from './styles.module.scss';

const WithdrawLiquidityConfirm = ({ data, afterWithdraw }) => {
  async function withdrawPool() {
    const store = initializeStore();
    const storeData = store.getState();

    const minAmountA = new BN(data.tokenA.balance).minus(data.tokenA.balance.times(data.tolerance));
    const minAmountB = new BN(data.tokenB.balance).minus(data.tokenB.balance.times(data.tolerance));

    function func() {
      return generateWithdrawPoolTRX(
        storeData.user.detail.address,
        getAssetDetails(data.tokenA),
        getAssetDetails(data.tokenB),
        data.userShare,
        minAmountA.toFixed(7),
        minAmountB.toFixed(7),
        new BN(data.withdrawPercent).isEqualTo(100),
      );
    }

    await showGenerateTrx(func, store.dispatch)
      .then((trx) => showSignResponse(trx, store.dispatch))
      .catch(console.error);

    afterWithdraw();
  }

  return (
    <div className="pb-4">
      <div className={styles.inpool}>
        <div className={styles.pair}>
          <div className={styles['pair-img']}><img src={extractLogoByToken(data.tokenA)} width={20} height={20} /></div>
          <div>{data.tokenA.code}</div>
        </div>
        <div>{humanizeAmount(data.tokenA.balance)}</div>
      </div>

      <div className={styles.inpool}>
        <div className={styles.pair}>
          <div className={styles['pair-img']}><img src={extractLogoByToken(data.tokenB)} width={20} height={20} /></div>
          <div>{data.tokenB.code}</div>
        </div>
        <div>{humanizeAmount(data.tokenB.balance)}</div>
      </div>

      <div className={styles.current}><AMMCurrentPrice poolData={data.poolData} /></div>

      <Button
        variant="primary"
        content="Confirm"
        fontWeight={500}
        className={styles.btn}
        onClick={withdrawPool}
      />
    </div>
  );
};

export default WithdrawLiquidityConfirm;
