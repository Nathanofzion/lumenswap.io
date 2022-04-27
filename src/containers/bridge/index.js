import { useForm, Controller, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { openConnectModal, openModalAction } from 'actions/modal';
import createOrderRequest from 'api/birdgeAPI/createOrder';
import BridgeContainer from 'containers/bridge/BridgeContainer';
import Button from 'components/Button';
import BN from 'helpers/BN';
import Input from 'components/Input';
import useIsLogged from 'hooks/useIsLogged';
import NumberOnlyInput from 'components/NumberOnlyInput';
import { useEffect, useState } from 'react';
import useUserAddress from 'hooks/useUserAddress';
import Submitting from 'components/Submitting';
import decimalCounter from './decimalCounter';
import bridgeFormCustomValidator from './bridgeFormCustomValidator';
import ConvertAssetInput from './ConvertAssetInput';
import { TOKEN_A_FORM_NAME, TOKEN_B_FORM_NAME } from './tokenFormNames';
import ConvertConfirmModalContent from './ConvertConfirmModalContent';
import styles from './styles.module.scss';
import FailDialog from './ConfirmModal/FailDialog';

const customValidateAmount = (value, onChange, formValues) => {
  const minAmountPrecision = Math.min(formValues[TOKEN_A_FORM_NAME].precision,
    formValues[TOKEN_B_FORM_NAME].precision);

  if (new BN(decimalCounter(value)).lte(minAmountPrecision)) {
    return onChange(value);
  }
  return () => {};
};

const BridgeConvert = ({ bridgeTokens }) => {
  const isLoggedIn = useIsLogged();
  const dispatch = useDispatch();
  const userBalances = useSelector((state) => state.userBalance);
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState,
    trigger,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      tokenA: bridgeTokens[0],
      tokenB: bridgeTokens.find((token) => token.name === bridgeTokens[0].ported_asset),
      amount: null,
      destination: null,
    },
    resolver: (formData) => bridgeFormCustomValidator(formData, userBalances),
  });
  const handleReverseTokens = () => () => {
    const currentValues = getValues();
    setValue(TOKEN_A_FORM_NAME, currentValues[TOKEN_B_FORM_NAME]);
    setValue(TOKEN_B_FORM_NAME, currentValues[TOKEN_A_FORM_NAME]);
  };
  const userAddress = useUserAddress();

  const onSubmit = (data) => {
    if (isLoggedIn) {
      setCreateOrderLoading(true);
      createOrderRequest({
        from_amount: data.amount,
        from_asset: data[TOKEN_A_FORM_NAME].name,
        user_destination: data.destination,
        by_address: userAddress,
      }).then((res) => {
        setCreateOrderLoading(false);
        if (res.status === 200) {
          return dispatch(
            openModalAction({
              modalProps: {
                className: 'main p-0',
                hasClose: false,
              },
              content: <ConvertConfirmModalContent convertInfo={res.data} />,
            }),
          );
        }
        return dispatch(openModalAction({
          modalProps: {
          },
          content: <FailDialog />,
        }));
      });
    } else {
      dispatch(openConnectModal());
    }
  };

  function generateSubmitButtonContent() {
    for (const error of Object.values(formState.errors)) {
      if (error && error.message) {
        return error.message;
      }
    }
    return 'Convert';
  }

  useEffect(() => {
    trigger();
  }, [useWatch({ control })]);

  return (
    <BridgeContainer title="Bridge Convert | Lumenswap">
      <div className="layout main d-flex justify-content-center">
        <div className={styles.card}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.container}>
              <ConvertAssetInput
                inputName={TOKEN_A_FORM_NAME}
                control={control}
                bridgeTokens={bridgeTokens}
                setValue={setValue}
              />
              <div className={styles.icon}>
                <span
                  onClick={handleReverseTokens()}
                  className="icon-arrow-down color-primary"
                />
              </div>
              <ConvertAssetInput
                inputName={TOKEN_B_FORM_NAME}
                control={control}
                bridgeTokens={bridgeTokens}
                setValue={setValue}
              />
            </div>
            <label className="label-primary mt-3">Amount</label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <NumberOnlyInput
                  type="number"
                  placeholder="1"
                  value={field.value}
                  onChange={(value) => {
                    customValidateAmount(value, field.onChange, getValues());
                  }}
                  className={styles.input}
                />
              )}
            />

            <label className="label-primary mt-3">Destination</label>
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="G …"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Button
              variant="primary"
              htmlType="submit"
              size="100%"
              fontWeight={500}
              className="mt-4"
              disabled={formState.isValidating || !formState.isValid || createOrderLoading}
              content={(createOrderLoading || formState.isValidating)
                ? <Submitting loadingSize={21} />
                : generateSubmitButtonContent()}
            />
          </form>
        </div>
      </div>
    </BridgeContainer>
  );
};

export default BridgeConvert;
