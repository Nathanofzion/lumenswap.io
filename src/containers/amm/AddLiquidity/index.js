import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BN from 'helpers/BN';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CSelectToken from 'components/CSelectToken';
import Button from 'components/Button';
import LiquidityInput from 'components/LiquidityInput';
import AMMCurrentPrice from 'components/AMMCurrentPrice';
import { openModalAction } from 'actions/modal';
import numeral from 'numeral';
import AMMPriceInput from 'containers/amm/AMMPriceInput';
import getAssetDetails from 'helpers/getAssetDetails';
import { getLiquidityPoolIdFromAssets, lexoOrderAssets, lexoOrderTokenWithDetails } from 'helpers/stellarPool';
import { getPoolDetailsById } from 'api/stellarPool';
import { extractLogo } from 'helpers/assetUtils';
import isSameAsset from 'helpers/isSameAsset';
import ConfirmLiquidity from '../ConfirmLiquidity';
import styles from './styles.module.scss';
import Tolerance from '../Tolerance';

const setLabel = (name, src) => (
  <div className="d-flex align-items-center">
    <Image src={src} width={20} height={20} alt={name} />
    <span className="ml-2">{name}</span>
  </div>
);

const AddLiquidity = ({ tokenA: initTokenA, tokenB: initTokenB, selectAsset }) => {
  const [poolData, setPoolData] = useState(null);
  const userBalance = useSelector((state) => state.userBalance);

  const [tokenA, tokenB] = lexoOrderTokenWithDetails(
    initTokenA,
    initTokenB,
  );

  const tokenABalance = userBalance
    .find((i) => isSameAsset(getAssetDetails(i.asset), tokenA))
    ?.balance;
  const tokenBBalance = userBalance
    .find((i) => isSameAsset(getAssetDetails(i.asset), tokenB))
    ?.balance;

  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState,
    errors,
    trigger,
    getValues,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      maxPrice: 1,
      minPrice: 0,
    },
  });

  const onSubmit = (data) => {
    const confirmData = {
      tokenA: {
        ...tokenA,
        amount: data.amountTokenA,
      },
      tokenB: {
        ...tokenB,
        amount: data.amountTokenB,
      },
      range: {
        min: data.minPrice,
        max: data.maxPrice,
      },
      poolData,
    };

    dispatch(
      openModalAction({
        modalProps: {
          title: 'Deposit Liquidity Confirm',
          className: 'main',
        },
        content: <ConfirmLiquidity
          data={confirmData}
        />,
      }),
    );
  };

  function errorGenerator() {
    for (const error of Object.values(errors)) {
      if (error.message) {
        return error.message;
      }
    }
    return 'Create';
  }

  const handleSelectAsset = (token) => {
    function onTokenSelect(asset) {
      const props = { tokenA: initTokenA, tokenB: initTokenB };
      if (token === 'tokenA') {
        props.tokenA = asset;
      }

      if (token === 'tokenB') {
        props.tokenB = asset;
      }

      selectAsset(props);
    }

    dispatch(
      openModalAction({
        modalProps: {
          title: 'Select asset',
          className: 'main',
        },
        content: <CSelectToken onTokenSelect={onTokenSelect} />,
      }),
    );
  };

  const validateAmountTokenA = (value) => {
    if (new BN(0).gt(value)) {
      return 'Amount is not valid';
    }
    if (new BN(value).gt(tokenABalance)) {
      return 'Insufficient balance';
    }
    return true;
  };

  const validateAmountTokenB = (value) => {
    if (new BN(0).gt(value)) {
      return 'Amount is not valid';
    }
    if (new BN(value).gt(tokenBBalance)) {
      return 'Insufficient balance';
    }
    return true;
  };

  const validateMinPrice = (value) => {
    if (value < 0) {
      return 'Min price is not valid';
    }
    if (new BN(value).gt(getValues('maxPrice')) || value === getValues('maxPrice')) {
      return 'Max price should be bigger';
    }
    return true;
  };

  const validateMaxPrice = (value) => {
    if (value < 0) {
      return 'Max price is not valid';
    }
    if (new BN(getValues('minPrice')).gt(value) || value === getValues('minPrice')) {
      return 'Max price should be bigger';
    }
    return true;
  };

  useEffect(() => {
    trigger();
  }, [JSON.stringify(getValues())]);

  useEffect(() => {
    async function loadData() {
      const poolId = getLiquidityPoolIdFromAssets(
        getAssetDetails(tokenA),
        getAssetDetails(tokenB),
      );

      try {
        const poolDetail = await getPoolDetailsById(poolId);
        setPoolData(poolDetail);
      } catch (e) {
        const sortedTokens = lexoOrderAssets(
          getAssetDetails(tokenA),
          getAssetDetails(tokenB),
        );

        const assetA = sortedTokens[0].isNative() ? 'native' : `${sortedTokens[0].getCode()}:${sortedTokens[0].getIssuer()}`;
        const assetB = sortedTokens[1].isNative() ? 'native' : `${sortedTokens[1].getCode()}:${sortedTokens[1].getIssuer()}`;

        setPoolData({
          reserves: [
            {
              asset: assetA,
              amount: 0,
            },
            {
              asset: assetB,
              amount: 0,
            },
          ],
        });
      }
    }

    loadData();
  }, [tokenA, tokenB]);

  return (
    <div className="pb-4">
      <h6 className={styles.label}>Select pair</h6>
      <div className="d-flex justify-content-between">
        <div className={styles.select} onClick={() => handleSelectAsset('tokenA')}>
          {setLabel(initTokenA.code, extractLogo(initTokenA))}
          <span className="icon-angle-down" />
        </div>
        <div className={styles.select} onClick={() => handleSelectAsset('tokenB')}>
          {setLabel(initTokenB.code, extractLogo(initTokenB))}
          <span className="icon-angle-down" />
        </div>
      </div>

      <div className={styles.current}>
        <AMMCurrentPrice poolData={poolData} />
      </div>

      <hr className={styles.hr} />

      <h6 className={styles.label}>Deposit liquidity</h6>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="amountTokenA"
          control={control}
          rules={{
            required: 'Amount is required',
            validate: validateAmountTokenA,
          }}
          render={(props) => (
            <LiquidityInput
              balance={`${numeral(tokenABalance).format('0,0.[0000000]')} ${tokenA.code}`}
              currency={tokenA.code}
              onChange={props.onChange}
              value={props.value}
              currencySrc={extractLogo(tokenA)}
            />
          )}
        />
        <Controller
          name="amountTokenB"
          control={control}
          rules={{
            required: 'Amount is required',
            validate: validateAmountTokenB,
          }}
          render={(props) => (
            <LiquidityInput
              onChange={props.onChange}
              value={props.value}
              balance={`${numeral(tokenBBalance).format('0,0.[0000000]')} ${tokenB.code}`}
              currency={tokenB.code}
              currencySrc={extractLogo(tokenB)}
              className="mt-3"
            />
          )}
        />
        <Tolerance onChange={() => {}} />

        <Button
          htmlType="submit"
          variant="primary"
          content={errorGenerator()}
          fontWeight={500}
          className={styles.btn}
          disabled={!formState.isValid || formState.isValidating}
        />
      </form>
    </div>
  );
};

export default AddLiquidity;
