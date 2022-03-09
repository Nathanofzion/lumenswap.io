import classNames from 'classnames';
import EmptyCheckCircle from 'assets/images/emptyCheckCircle';
import Clock from 'assets/images/clock';
import ArrowRight from 'assets/images/arrowRight';
import styles from './styles.module.scss';

const StatusLabel = ({ status }) => {
  if (status.toLowerCase() === 'success') {
    return (
      <div className={classNames('d-flex align-items-center',
        styles['status-success'])}
      >
        <EmptyCheckCircle />
        <div className="ml-1">Success</div>
      </div>
    );
  }

  if (status.toLowerCase() === 'pending') {
    return (
      <div className={classNames('d-flex align-items-center',
        styles['status-pending'])}
      >
        <Clock />
        <div className="mx-1">Pending</div>
        <ArrowRight />
      </div>
    );
  }

  if (status.toLowerCase() === 'expired') {
    return (
      <div className={styles['status-expired']}>
        Expired
      </div>
    );
  }
  return null;
};

export default StatusLabel;
