import React from 'react';

import Button from 'components/Button';
import { useDispatch, useSelector } from 'react-redux';
import generateManageBuyTRX from 'stellar-trx/generateManageBuyTRX';
import { getAssetDetails } from 'helpers/asset';
import BN from 'helpers/BN';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import humanizeAmount from 'helpers/humanizeAmount';
import useDefaultTokens from 'hooks/useDefaultTokens';
import { extractTokenFromCode } from 'helpers/defaultTokenUtils';
import styles from './styles.module.scss';

const ConfirmBidModal = ({ data, baseToken, reloadData }) => {
  const dispatch = useDispatch();
  const userAddress = useSelector((state) => state.user.detail.address);
  const defaultTokens = useDefaultTokens();
  const handleConfirm = () => {
    function func() {
      return generateManageBuyTRX(
        userAddress,
        getAssetDetails(baseToken),
        getAssetDetails(extractTokenFromCode('XLM', defaultTokens)),
        new BN(data.tokenAmount).toFixed(7),
        new BN(data.price).toFixed(7),
        0,
      );
    }

    showGenerateTrx(func, dispatch)
      .then((trx) => showSignResponse(trx, dispatch))
      .catch(console.log)
      .then(reloadData);
  };

  return (
    <div>
      <div className={styles.text}>
        You will buy {' '}
        <span>
          {humanizeAmount(data.tokenAmount)}
        </span> {baseToken.code} for {' '}
        <span>
          {humanizeAmount(new BN(data.price).times(data.tokenAmount).toFixed(7))}
        </span> XLM
      </div>
      <Button
        onClick={handleConfirm}
        variant="primary"
        content="Confirm"
        className={styles.btn}
      />
    </div>
  );
};

export default ConfirmBidModal;
