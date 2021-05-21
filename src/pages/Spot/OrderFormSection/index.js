import InputGroup from 'components/InputGroup';
import CustomSlider from 'components/CustomSlider';
import Button from 'components/Button';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { openConnectModal } from 'actions/modal';
import isSameAsset from 'helpers/isSameAsset';
import XLM from 'tokens/XLM';
import getAssetDetails from 'helpers/getAssetDetails';
import sevenDigit from 'helpers/sevenDigit';
import USDC from 'tokens/USDC';
import BN from 'helpers/BN';
import { useState } from 'react';
import generateManageBuyTRX from 'stellar-trx/generateManageBuyTRX';
import generateManageSellTRX from 'stellar-trx/generateManageSellTRX';
import store from 'store';
import showSignResponse from 'helpers/showSignResponse';
import showGenerateTrx from 'helpers/showGenerateTrx';
import styles from '../styles.module.scss';

function showBalance(isLogged, foundBalance) {
  if (!isLogged) {
    return '-';
  }

  if (!foundBalance) {
    return '0';
  }

  return sevenDigit(foundBalance);
}

const InnerForm = ({
  baseAsset, counterAsset, mainAsset, type,
}) => {
  const isLogged = useSelector((state) => state.user.logged);
  const userBalance = useSelector((state) => state.userBalance);
  const foundBalance = userBalance.find((i) => isSameAsset(i.asset, type === 'sell' ? baseAsset : counterAsset))?.balance;
  const [sliderValue, setSliderValue] = useState(0);

  const isSell = type === 'sell';

  const {
    handleSubmit, setValue, getValues, control,
  } = useForm();

  async function onSubmit(data) {
    async function func() {
      const address = store.getState().user.detail.address;
      if (type === 'buy') {
        return generateManageBuyTRX(
          address,
          baseAsset,
          counterAsset,
          data.amount,
          data.price,
          0,
        );
      } if (type === 'sell') {
        return generateManageSellTRX(
          address,
          counterAsset,
          baseAsset,
          data.amount,
          data.price,
          0,
        );
      }

      throw new Error('Not supported type');
    }

    showGenerateTrx(func)
      .then(showSignResponse)
      .catch(console.error);
  }

  function onInputChange(field) {
    return () => {
      const values = getValues();

      if ((field === 'price' || field === 'amount') && !!values.amount && !!values.price) {
        const res = new BN(values.price).times(values.amount);

        if (isLogged) {
          const perc = parseInt(new BN(res).div(foundBalance).times(100).toFixed(0), 10);
          setSliderValue(perc > 100 ? 100 : perc);
        }

        setValue('total', res.toString());
      }

      if (field === 'total' && !!values.price && !!values.total) {
        if (isLogged) {
          const perc = parseInt(new BN(values.total).div(foundBalance).times(100).toFixed(0), 10);
          setSliderValue(perc > 100 ? 100 : perc);
        }

        const res = new BN(values.total).div(values.price).toString();
        setValue('amount', res);
      }
    };
  }

  function onSliderChange(perc) {
    if (isLogged && foundBalance) {
      const values = getValues();

      if (values.price) {
        const purePerc = new BN(perc).div(100);
        const total = purePerc.times(foundBalance);
        const amount = total.div(values.price);

        if (isSell) {
          setValue('total', amount.toString());
          setValue('amount', total.toString());
        } else {
          setValue('amount', amount.toString());
          setValue('total', total.toString());
        }
      }
    }
  }

  let buttonContent = 'Conent Wallet';
  if (isLogged) {
    buttonContent = type === 'buy' ? `Buy ${mainAsset.getCode()}` : `Sell ${mainAsset.getCode()}`;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className={styles['form-title']}>{type === 'sell' ? 'Sell' : 'Buy'} {mainAsset.getCode()}</div>
        <div className={styles['form-value']}><span className="icon-wallet" />
          {showBalance(isLogged, foundBalance)}
        </div>
      </div>
      <div className="mb-2">
        <Controller
          name="price"
          control={control}
          rules={{ required: true }}
          render={(props) => (
            <InputGroup
              {...props}
              rightLabel={counterAsset.getCode()}
              leftLabel="Price"
              onChangeInput={onInputChange('price')}
            />
          )}
        />
      </div>
      <div className="mb-3">
        <Controller
          name="amount"
          control={control}
          rules={{ required: true }}
          render={(props) => (
            <InputGroup
              {...props}
              rightLabel={baseAsset.getCode()}
              leftLabel="Amount"
              onChangeInput={onInputChange('amount')}
            />
          )}
        />
      </div>
      <div className="mb-3">
        <CustomSlider onChange={onSliderChange} upperValue={sliderValue} />
      </div>
      <div className="mb-2">
        <Controller
          name="total"
          control={control}
          rules={{
            required: true,
            validate: () => {
              let toCompare;
              if (type === 'buy') {
                toCompare = getValues().total;
              } else if (type === 'sell') {
                toCompare = getValues().amount;
              }

              return new BN(toCompare).isLessThanOrEqualTo(foundBalance);
            },
          }}
          render={(props) => (
            <InputGroup
              {...props}
              rightLabel={counterAsset.getCode()}
              leftLabel="Total"
              onChangeInput={onInputChange('total')}
            />
          )}
        />
      </div>
      <Button
        htmlType="submit"
        variant={type}
        content={buttonContent}
        fontWeight={500}
        className={styles.button}
        onClick={(e) => {
          if (!isLogged) {
            e.preventDefault();
            openConnectModal();
          }
        }}
      />
    </form>
  );
};

const OrderFormSection = () => (
  <div className="row" style={{ margin: '0 -24px' }}>
    <div className="col-md-6 col-sm-12 col-12 px-4">
      <InnerForm
        baseAsset={getAssetDetails(XLM)}
        counterAsset={getAssetDetails(USDC)}
        mainAsset={getAssetDetails(XLM)}
        type="buy"
      />
    </div>
    <div className="col-md-6 col-sm-12 col-12 px-4 mt-0 mt-md-0 mt-sm-4 mt-4">
      <InnerForm
        baseAsset={getAssetDetails(XLM)}
        counterAsset={getAssetDetails(USDC)}
        mainAsset={getAssetDetails(XLM)}
        type="sell"
      />
    </div>
  </div>
);

export default OrderFormSection;
