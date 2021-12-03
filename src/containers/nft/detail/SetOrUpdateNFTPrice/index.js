import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import getAssetDetails from 'helpers/getAssetDetails';
import { useSelector, useDispatch } from 'react-redux';
import InputGroup from 'components/InputGroup';
import Button from 'components/Button';
import BN from 'helpers/BN';
import { ONE_LUSI_AMOUNT } from 'appConsts';
import generateManageSellTRX from 'stellar-trx/generateManageSellTRX';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import numeral from 'numeral';
import NLSP from 'tokens/NLSP';
import styles from './styles.module.scss';

const SetOrUpdateNFTPrice = ({
  lusiAssetCode, mode, offerId, afterSetPrice,
}) => {
  const dispatch = useDispatch();
  const userAddress = useSelector((state) => state.user.detail.address);

  const {
    control, handleSubmit, errors, formState, trigger, getValues,
  } = useForm({ mode: 'onChange' });

  const onSubmit = (data) => {
    function func() {
      if (mode === 'update') {
        return generateManageSellTRX(
          userAddress,
          getAssetDetails(NLSP),
          getAssetDetails({
            code: lusiAssetCode,
            issuer: process.env.REACT_APP_LUSI_ISSUER,
          }),
          ONE_LUSI_AMOUNT,
          new BN(data.price).times(10 ** 7).toFixed(0),
          offerId,
        );
      }

      return generateManageSellTRX(
        userAddress,
        getAssetDetails(NLSP),
        getAssetDetails({
          code: lusiAssetCode,
          issuer: process.env.REACT_APP_LUSI_ISSUER,
        }),
        ONE_LUSI_AMOUNT,
        new BN(data.price).times(10 ** 7).toFixed(0),
        '0',
      );
    }

    showGenerateTrx(func, dispatch)
      .then((trx) => showSignResponse(trx, dispatch))
      .catch(console.log)
      .then(afterSetPrice);
  };

  useEffect(() => {
    trigger();
  }, []);

  const validatePrice = (price) => {
    if (new BN(0).gt(price)) {
      return 'Price is not valid';
    }

    const lessThanNLSP = '0.0000001';
    if (new BN(price).lt(lessThanNLSP)) {
      return 'Price must be greater than 0';
    }

    const moreThanNLSP = 100;
    if (new BN(price).gt(moreThanNLSP)) {
      return `Price must be less than ${moreThanNLSP}`;
    }

    return true;
  };

  function generateError() {
    for (const error of Object.values(errors)) {
      if (error) {
        return error.message;
      }
    }

    return 'Confirm';
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="label-primary mb-2 mt-4">Price</label>
        <Controller
          name="price"
          control={control}
          defaultValue=""
          rules={{
            required: 'Price is required',
            validate: validatePrice,
          }}
          render={(props) => (
            <InputGroup
              variant="primary"
              placeholder="100"
              rightLabel="NLSP"
              value={props.value}
              onChange={props.onChange}
            />
          )}
        />
        <div className={styles.info}>
          <span>{numeral(getValues('price')).format('0,0')} NLSP = {numeral(new BN(getValues('price')).times(10 ** 7).toFixed(0)).format('0,0')} LSP</span>
        </div>
        <Button
          htmlType="submit"
          variant="primary"
          content={generateError()}
          className={styles.btn}
          disabled={!formState.isValid || formState.isValidating}
        />
      </form>
    </div>
  );
};

export default SetOrUpdateNFTPrice;
