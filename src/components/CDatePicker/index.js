import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import CalenderIcon from 'assets/images/calender';

import styles from './styles.module.scss';

const CustomInput = forwardRef(({ value, onClick, disabled },
  ref) => (
    <div className={disabled ? styles['disabled-select'] : styles.select} ref={ref} onClick={onClick}>
      {moment(value).format('DD MMM YYYY')}
      <CalenderIcon />
    </div>
));

const CDatePicker = ({
  onChange, value, minDate, disabled,
}) => {
  const onChangeDate = (selectedDate) => {
    onChange(selectedDate);
  };

  return (
    <DatePicker
      selected={value ?? new Date()}
      onChange={onChangeDate}
      popperClassName={styles.date}
      customInput={<CustomInput disabled={disabled} />}
      minDate={minDate}
      disabled={disabled}
    />
  );
};

export default CDatePicker;
