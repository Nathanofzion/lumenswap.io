import { useEffect, useState } from 'react';

import Input from 'components/Input';

import styles from './styles.module.scss';

const Options = ({ control, Controller }) => {
  const initialOptions = [1, 2];
  const [count, setCount] = useState(2);
  const [options, setOptions] = useState(initialOptions);

  const onAddOption = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    if (count > 2) {
      setOptions((oldOptions) => [...oldOptions, count]);
    }
  }, [count]);

  return (
    <div className={styles.panel}>
      <div className={styles['panel-header']}>Options</div>
      <div className={styles['panel-body']}>
        {options.map((option) => (
          <div key={option}>
            <Controller
              name={`option${option}`}
              control={control}
              defaultValue=""
              render={(props) => (
                <div className={styles.group}>
                  <label className="label-primary">Option {option}</label>
                  <Input
                    type="text"
                    placeholder="Enter your address"
                    height={40}
                    fontSize={16}
                    value={props.value}
                    onChange={props.onChange}
                  />
                </div>
              )}
            />
          </div>
        ))}

        <button
          type="button"
          className={styles['btn-dashed']}
          onClick={onAddOption}
        >Add option
        </button>

      </div>
    </div>
  );
};

export default Options;
