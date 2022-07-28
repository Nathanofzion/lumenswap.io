import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openModalAction } from 'actions/modal';
import useIsLogged from 'hooks/useIsLogged';
import { checkItemDropped } from 'api/nft';
import ClaimItemModal from '../ClaimItemModal';

import styles from './styles.module.scss';

function loadRewardItem(userAddress, setRewardItem) {
  checkItemDropped(userAddress).then((res) => {
    setRewardItem(res.data.lusi);
  }).catch(() => {
    setRewardItem(null);
  });
}

function ClaimItemBtn() {
  const [rewardItem, setRewardItem] = useState(null);
  const userAddress = useSelector((state) => state.user.detail.address);
  const isLogged = useIsLogged();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogged) {
      loadRewardItem(userAddress, setRewardItem);
    }
  }, [isLogged]);

  const handleOpenModal = () => {
    if (rewardItem) {
      dispatch(
        openModalAction({
          modalProps: { title: `You won #${rewardItem.assetCode}` },
          content: <ClaimItemModal
            item={rewardItem}
            loadRewardItem={() => loadRewardItem(userAddress, setRewardItem)}
          />,
        }),
      );
    }
  };

  if (!isLogged || !rewardItem) {
    return null;
  }

  return (
    <div onClick={handleOpenModal} className={styles.main}>
      <div className={styles.items}>
        <div className={styles.logo}>
          <img src={rewardItem.imageUrl} width={28} height={28} />
        </div>
        <span>Claim my item</span>
      </div>
    </div>
  );
}

export default ClaimItemBtn;
