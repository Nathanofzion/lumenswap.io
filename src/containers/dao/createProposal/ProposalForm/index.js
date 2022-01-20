import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Controller, useForm } from 'react-hook-form';
// import dynamic from 'next/dynamic';

import AlertIcon from 'assets/images/alert';
import Button from 'components/Button';
import Options from './Options';

import styles from './styles.module.scss';

// const Datepicker = dynamic(() => import('components/Datepicker'), {
//     ssr: false,
// });

const ProposalForm = ({ setStatus }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndtDate] = useState(new Date());
  const [result, setResult] = useState('');
  const {
    handleSubmit,
    control,
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    console.log(data);
    setResult(data);
    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
    }, 3000);
  };

  return (
    <div>
      <div className={classNames(styles.alert, 'mb-4')}>
        <AlertIcon />
        You need to have a minimum of
        <span className="mx-1">10K RBT</span>
        in order to submit a proposal.
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="question"
          control={control}
          defaultValue=""
          render={(props) => (
            <div className="d-flex align-items-center mb-4">
              <input
                type="text"
                className={styles.input}
                placeholder="Ask a question…"
                value={props.value}
                onChange={props.onChange}
                maxLength={30}
              />
              {props.value
                && (
                <div className={styles.length}>
                  <span>{props.value.length}</span>/30
                </div>
                )}
            </div>
          )}
        />
        <Controller
          name="proposal"
          control={control}
          defaultValue=""
          render={(props) => (
            <div className="d-flex flex-column mb-4">
              <textarea
                className={styles.textarea}
                placeholder="Tell more about your proposal (optional)"
                value={props.value}
                onChange={props.onChange}
                maxLength={300}
              />
              {props.value
                && (
                <div className={classNames(styles.length, 'text-right mt-2')}>
                  <span>{props.value.length}</span>/300
                </div>
                )}
            </div>
          )}
        />
        <Options control={control} Controller={Controller} />

        <div className="d-flex mt-4">
          <div className="flex flex-column">
            <label className="label-primary">Start date</label>
            {/* <Datepicker */}
            {/*  selected={startDate} */}
            {/*  onChange={(date) => setStartDate(date)} */}
            {/* /> */}
          </div>
        </div>

        <Button
          htmlType="submit"
          variant="primary"
          className={styles.submit}
        >Create proposal
        </Button>
      </form>
    </div>
  );
};

ProposalForm.propTypes = {

};

export default ProposalForm;
