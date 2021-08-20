import { useDispatch } from 'react-redux';
import Image from 'next/image';
import Button from 'components/Button';
import { openConnectModal } from 'actions/modal';
import connectIcon from 'assets/images/connectIcon.svg';
import styles from './styles.module.scss';

const LoginRequired = ({ text }) => {
  const dispatch = useDispatch();
  return (
    <div className="row justify-content-center">
      <div className="col-auto">
        <div className={styles['connect-container']}>
          <div className={styles['div-icon']}>
            <Image width="40" height="34" src={connectIcon} alt="icon" />
          </div>
          <div className={styles['connect-text']}>
            {text}
          </div>
          <Button
            variant="secondary"
            content="Connect Wallet"
            fontWeight="500"
            className={styles['connect-btn']}
            onClick={() => {
              dispatch(openConnectModal());
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;
