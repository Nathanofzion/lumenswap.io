import classNames from 'classnames';
import ArrowPagination from 'assets/images/arrow-pagination.svg';
import ArrowWhitePagination from 'assets/images/arrow-white.svg';
import ArrowGrayPagination from 'assets/images/arrow-gray-pagination.svg';
import { useEffect, useState } from 'react';
import useCurrentTheme from 'hooks/useCurrentTheme';
import { generateRange } from './helpers';
import styles from './style.module.scss';

const arrowIconSRC = {
  light: {
    disabled: ArrowGrayPagination,
    enabled: ArrowPagination,
  },
  dark: {
    disabled: ArrowGrayPagination,
    enabled: ArrowWhitePagination,
  },
};

const CPagination = ({ pages, currentPage: initCurrentPage, onPageClick }) => {
  const [currentPage, setCurrentPage] = useState(initCurrentPage);
  const currentTheme = useCurrentTheme();

  useEffect(() => {
    setCurrentPage(initCurrentPage);
  }, [initCurrentPage]);

  function onPaginationClick(page) {
    if (!page.label) {
      if (initCurrentPage !== page) {
        onPageClick(page);
      }
    } else if (page.fnc === 'goback') {
      if (currentPage - 3 < 1) {
        setCurrentPage(1);
      } else {
        setCurrentPage((prev) => prev - 3);
      }
    } else if (page.fnc === 'gonext') {
      if (currentPage + 3 > pages) {
        setCurrentPage(pages);
      } else {
        setCurrentPage((prev) => prev + 3);
      }
    }
  }

  const paginationArray = generateRange(pages, 1, currentPage);
  return (
    <div className={styles['pagination-container']}>
      <button disabled={currentPage <= 1} type="button" onClick={() => onPageClick(currentPage - 1)}>
        <img
          className={styles.arrowLeft}
          src={arrowIconSRC[currentTheme][currentPage <= 1 ? 'disabled' : 'enabled']}
          objectFit="contain"
        />
      </button>
      <div className={styles['pagination-items']}>
        {paginationArray.map((page, i) => (
          <div
            onClick={() => onPaginationClick(page)}
            key={i}
            className={classNames(
              styles[`pagination-${page.label ? 'spread' : 'item'}`],
              initCurrentPage === page && styles.active,
            )}
          >
            {page.label || page}
          </div>
        ))}
      </div>
      <button type="button" disabled={currentPage >= pages} onClick={() => onPageClick(currentPage + 1)}>
        <img
          className={styles.arrowRight}
          src={arrowIconSRC[currentTheme][currentPage >= pages ? 'disabled' : 'enabled']}
          objectFit="contain"
        />
      </button>
    </div>
  );
};

export default CPagination;
