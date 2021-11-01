import BN from 'helpers/BN';
import styles from './styles.module.scss';

function AMMPriceInput({
  value, onChange, placeholder, defaultValue, token, type,
}) {
  const handleDecreaseValue = () => {
    if (parseInt(value, 10) > 0) {
      onChange(parseInt(value, 10) - 1);
    }
  };
  const handleIncreaseValue = () => {
    if (!parseInt(value, 10)) {
      onChange(0 + 1);
    } else if (parseInt(value, 10)) {
      onChange(parseInt(value, 10) + 1);
    }
  };

  return (
    <div className={styles.main}>
      <span>{type} {token.code} price</span>
      <div className={styles['input-container']}>
        <div className={styles['btns-container']}>
          <div className={styles.btns} onClick={handleDecreaseValue}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#656872" className="bi bi-dash" viewBox="0 0 16 16">
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
            </svg>
          </div>
        </div>
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
          defaultValue={defaultValue}
          type="number"
        />
        <div className={styles['btns-container']}>
          <div className={styles.btns} onClick={handleIncreaseValue}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#656872" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AMMPriceInput;
