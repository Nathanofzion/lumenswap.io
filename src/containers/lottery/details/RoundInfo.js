import classNames from 'classnames';
import Image from 'next/image';
import ArrowIcon from 'assets/images/arrow-right-icon.png';
import QuestionIcon from 'assets/images/question-icon.png';
import styles from './style.module.scss';

const RoundInfo = ({ round }) => (
  <div style={{ height: '100%' }} className={classNames('row', styles['round-info'])}>
    <div className="col-12 d-flex flex-column">
      <p className={styles['box-title']}>Round Info</p>
      <div style={{ marginBottom: 15 }} className="d-flex justify-content-between">
        <span className={styles['info-title']}>Period</span>
        <span>1 Sep 2021
          <span style={{ marginLeft: 6, marginRight: 6 }}>
            <Image src={ArrowIcon} width={12} height={12} />
          </span>
          1 Oct 2021
        </span>
      </div>
      <div style={{ marginBottom: 15 }} className="d-flex justify-content-between">
        <span className={styles['info-title']}>
          Ticket
          <span style={{ marginLeft: 2, height: 18 }}>
            <Image src={QuestionIcon} width={16} height={16} />
          </span>
        </span>
        <span>10,000</span>
      </div>
      <div style={{ marginBottom: 5 }} className="d-flex justify-content-between">
        <span className={styles['info-title']}>
          Participants
          <span style={{ marginLeft: 2, height: 18 }}>
            <Image src={QuestionIcon} width={16} height={16} />
          </span>
        </span>
        <span>500</span>
      </div>
    </div>
    <div className={classNames('col-12 d-flex flex-column mt-auto', styles['winner-info'])}>
      <p style={{ margin: 4 }}>Winner Info</p>
      <p>The winner will be determined in this Ledger Number:</p>
      <div>123456789</div>
    </div>
  </div>
);

export default RoundInfo;
