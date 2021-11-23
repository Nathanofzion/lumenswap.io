import rightMiniArrow from 'assets/images/right-mini-arrow.svg';
import leftMiniArrow from 'assets/images/left-mini-arrow.svg';
import blueRightMiniArrow from 'assets/images/blue-right-mini-arrow.svg';
import blueLeftMiniArrow from 'assets/images/blue-left-mini-arrow.svg';
import classNames from 'classnames';
import Image from 'next/image';
import Button from 'components/Button';
import styles from './styles.module.scss';

function InfinitePagination({
  onNextPage, onPrevPage, className, hasNextPage, hasPreviousPage,
}) {
  return (
    <div className={classNames(styles.main, className)}>
      <Button
        onClick={onNextPage}
        className={hasNextPage ? styles['next-btn'] : styles['next-btn-disabled']}
      >
        <span>Next Page</span>
        <div><Image
          width={10}
          height={11}
          src={hasNextPage ? blueRightMiniArrow : rightMiniArrow}
        />
        </div>
      </Button>
      <Button
        onClick={onPrevPage}
        className={hasPreviousPage ? styles['prev-btn'] : styles['prev-btn-disabled']}
      >
        <div><Image
          width={10}
          height={11}
          src={hasPreviousPage ? blueLeftMiniArrow : leftMiniArrow}
        />
        </div>
        <span>Previous Page</span>
      </Button>
    </div>
  );
}

export default InfinitePagination;
