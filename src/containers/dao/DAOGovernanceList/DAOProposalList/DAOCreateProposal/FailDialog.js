import classNames from 'classnames';
import AngleIcon from 'assets/images/angleRight';
import FailIcon from 'assets/images/FailIcon';
import Button from 'components/Button';
import useCurrentTheme from 'hooks/useCurrentTheme';
import styles from './styles.module.scss';

function FailDialog({ message, setStatus }) {
  const currentTheme = useCurrentTheme();
  const handleReset = () => {
    setStatus({ value: '', message: '' });
  };
  return (
    <div className={classNames(styles.card, styles['card-small'], styles.success)}>
      <FailIcon color={currentTheme === 'light' ? null : '#E44545'} />
      <div className={styles['success-title']}>Failed</div>
      <p className={styles['success-msg']}>
        {message || 'Your proposal creation failed.'}
      </p>
      <Button
        variant="primary"
        onClick={handleReset}
        className={styles['success-btn']}
      >
        Try Again
        <AngleIcon />
      </Button>
    </div>
  );
}

export default FailDialog;
