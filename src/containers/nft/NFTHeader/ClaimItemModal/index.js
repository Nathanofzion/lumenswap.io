import { useDispatch, useSelector } from 'react-redux';
import { openModalAction } from 'actions/modal';
import Button from 'components/Button';
import Submitting from 'components/Submitting';
import { getAssetDetails, isSameAsset } from 'helpers/asset';
import generateTrustlineTRX from 'stellar-trx/generateTrustlineTRX';
import showGenerateTrx from 'helpers/showGenerateTrx';
import showSignResponse from 'helpers/showSignResponse';
import TransactionResponse from 'blocks/TransactionResponse';
import { generateTransactionURL } from 'helpers/explorerURLGenerator';
import { claimItemApi } from 'api/nft';
import { useState } from 'react';
import styles from './styles.module.scss';

function ButtonContent({ step, loading }) {
  if (step === null || loading) {
    return <Submitting loadingSize={21} />;
  }

  if (step === 'trust') {
    return 'Create trustline';
  }

  return 'Claim';
}

const handleClaim = async (item, itemAsset, userAddress, step, dispatch,
  setLoading, loadRewardItem) => {
  if (step === 'trust') {
    // eslint-disable-next-line no-inner-declarations
    function func() {
      return generateTrustlineTRX(userAddress, itemAsset);
    }

    await showGenerateTrx(func, dispatch)
      .then((trx) => showSignResponse(trx, dispatch, () => {
        dispatch(
          openModalAction({
            modalProps: { title: `You won #${item.assetCode}` },
            content: <ClaimItemModal item={item} loadRewardItem={loadRewardItem} />,
          }),
        );
      }))
      .catch(console.error);
  } else {
    setLoading(true);
    try {
      const res = await claimItemApi(userAddress);
      dispatch(openModalAction({
        modalProps: {},
        content: <TransactionResponse
          message={res.data.hash}
          status="success"
          title="Success Transaction"
          btnText="View on Explorer"
          btnType="link"
          btnLink={generateTransactionURL(res.data.hash)}
        />,
      }));
      loadRewardItem();
    } catch (e) {
      dispatch(openModalAction({
        modalProps: {},
        content: <TransactionResponse
          message={e.message}
          status="failed"
          title="Failed"
        />,
      }));
    }
  }
};

const ClaimItemModal = ({ item, loadRewardItem }) => {
  const userBalances = useSelector((state) => state.userBalance);
  const userAddress = useSelector((state) => state.user.detail.address);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  let step = null;
  const itemAsset = getAssetDetails({
    code: item.assetCode,
    issuer: process.env.REACT_APP_LUSI_ISSUER,
  });

  let found = false;
  for (const balance of userBalances) {
    const currentAsset = getAssetDetails({
      code: balance.asset.code,
      issuer: balance.asset.issuer,
    });

    if (isSameAsset(currentAsset, itemAsset)) {
      step = 'claim';
      found = true;
      break;
    }
  }

  if (!found) {
    step = 'trust';
  }
  let info = `To get started, you need to create a trust line for the #${item.assetCode}.`;

  if (step === 'claim') {
    info = 'This is the final step to claiming your Item. Please click Claim.';
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        {info}
      </div>
      <div className={styles.img}>
        <img
          loading="lazy"
          src={item.imageUrl}
          className={styles['lusi-img']}
        />
      </div>
      <Button
        onClick={() => handleClaim(item,
          itemAsset, userAddress, step, dispatch, setLoading, loadRewardItem)}
        htmlType="submit"
        variant="primary"
        className={styles.btn}
        disabled={step === null || loading}
      >
        <ButtonContent step={step} loading={loading} />
      </Button>
    </div>
  );
};

export default ClaimItemModal;
