import classNames from 'classnames';
import Loading from 'components/Loading';
import humanizeAmount from 'helpers/humanizeAmount';
import styles from '../../styles.module.scss';

const SendAmountLoading = ({ convertInfo }) => (
  <>
    <p className={styles.text}>
      PWe are sending {humanizeAmount(convertInfo.amount)} {convertInfo.tokenA.name}
      {' '}to your address. Please be patient.
    </p>

    <div className={classNames(styles.loading, styles['loading-one'])}>
      <Loading size={40} />
    </div>
  </>
);

export default SendAmountLoading;
