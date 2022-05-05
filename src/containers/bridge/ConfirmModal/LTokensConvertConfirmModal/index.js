import { useEffect, useRef, useState } from 'react';
import CSteps from 'components/CSteps';
import SuccessDialog from 'containers/bridge/ConfirmModal/SuccessDialog';
import generatePaymentTRX from 'stellar-trx/generatePaymentTRX';
import { useDispatch } from 'react-redux';
import ConvertConfirmModalContent from 'containers/bridge/ConvertConfirmModalContent';
import useUserAddress from 'hooks/useUserAddress';
import { getAssetDetails } from 'helpers/asset';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import openModalAction from 'actions/modal';
import { orderStates } from 'containers/bridge/orderStates';
import getSingleOrder from 'api/birdgeAPI/getSingleOrder';
import ConfirmLTokenTransaction from './ConfirmLTokenTransaction';
import ConfirmTransactionLoading from './ConfirmTransactionLoading';
import styles from '../styles.module.scss';

const LTokensConvertCofirmModal = ({ convertInfo }) => {
  const dispatch = useDispatch();
  const [currentConvertInfo, setCurrentConvertInfo] = useState(convertInfo);
  const getConvertInfoIntervalRef = useRef(null);
  const userAddress = useUserAddress();
  const [signLoading, setSignLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transactionResponseInfo, setTransactionResponseInfo] = useState(null);

  useEffect(() => {
    getConvertInfoIntervalRef.current = setInterval(() => {
      getSingleOrder(currentConvertInfo.id).then((newConvertInfo) => {
        setCurrentConvertInfo(newConvertInfo);
      });
    }, 5000);
    return () => { clearInterval(getConvertInfoIntervalRef.current); };
  }, []);

  useEffect(() => {
    if (currentConvertInfo.state === orderStates.AWAITING_USER_PAYMENT) {
      setCurrentStep(0);
    }
    if (currentConvertInfo.state === orderStates.USER_PAID) {
      setSignLoading(true);
    }
    if (currentConvertInfo.state === orderStates.SENDING) {
      setCurrentStep(1);
    }
    if (currentConvertInfo.state === orderStates.DONE) {
      setCurrentStep(2);
    }
  }, []);

  const handleCloseSignModal = () => {
    dispatch(
      openModalAction({
        modalProps: {
          className: 'main p-0',
          hasClose: false,
        },
        content: <ConvertConfirmModalContent convertInfo={currentConvertInfo} />,
      }),
    );
    setSignLoading(true);
  };

  const sendConvertRequest = () => {
    async function generateTRXHandler() {
      return generatePaymentTRX(
        userAddress,
        '1',
        getAssetDetails({
          code: currentConvertInfo.from_asset.name, issuer: process.env.REACT_APP_L_ISSUER,
        }),
        currentConvertInfo.wallet.address,
        currentConvertInfo.memo,
      );
    }

    showGenerateTrx(generateTRXHandler, dispatch)
      .then(async (trx) => {
        const trxHash = await showSignResponse(trx, dispatch, handleCloseSignModal);
        setTransactionResponseInfo({ trx_hash: trxHash });
      })
      .catch(console.error);
  };

  const convertSteps = [
    {
      content: <ConfirmLTokenTransaction
        convertInfo={currentConvertInfo}
        signLoading={signLoading}
        sendConvertRequest={sendConvertRequest}
      />,
    },
    {
      content: <ConfirmTransactionLoading
        convertInfo={currentConvertInfo}
        transactionInfo={transactionResponseInfo}
      />,
    },
    {
      content: <SuccessDialog
        responseInfo={currentConvertInfo}
      />,
    },
  ];
  return (
    <div className={styles.container}>
      <CSteps currentStep={currentStep} steps={convertSteps} />
    </div>
  );
};

export default LTokensConvertCofirmModal;
