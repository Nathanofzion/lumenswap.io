import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import ArrowDown from 'assets/images/arrow-down.svg';
import ArrowDownFill from 'assets/images/arrow-down-fill.svg';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.scss';

const TableRow = ({ columns, data }) => (
  <tr className={styles.row}>
    {columns.map((column) => (
      <td className={styles['row-item']}>
        <section>
          {column.render ? column.render(data) : data[column.dataIndex]}
        </section>
      </td>
    ))}
  </tr>
);

const CTable = ({
  columns,
  dataSource,
  className,
  noDataMessage: NoDataMessage,
  rowLink,
}) => {
  if (!dataSource || dataSource === null) {
    return <NoDataMessage />;
  }
  if (dataSource.length === 0) {
    return <NoDataMessage />;
  }

  const [sortIndex, setSortIndex] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (newSortIndex) => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    setSortIndex(newSortIndex);
  };

  const sortColumn = columns.find((column) => column.dataIndex === sortIndex);

  return (
    <div className={className ?? styles['table-container']}>
      <table className={styles.table}>
        <tr className={styles['header-table']}>
          {columns.map((title) => (
            <th
              style={title.style ?? { width: `${100 / columns.length}%` }}
              key={title.key}
            >
              <span style={{ position: 'relative' }}>
                {title.title}{' '}
                {title.sortFunc && (
                  <span className={styles.sort}>
                    <Image
                      src={sortIndex === title.dataIndex && sortOrder === 'asc' ? ArrowDownFill : ArrowDown}
                      width={8}
                      height={5}
                      className={styles.sort_icon}
                      onClick={() => handleSort(title.dataIndex)}
                    />
                    <Image
                      src={sortIndex === title.dataIndex && sortOrder === 'desc' ? ArrowDownFill : ArrowDown}
                      width={8}
                      height={5}
                      onClick={() => handleSort(title.dataIndex)}
                    />
                  </span>
                )}
              </span>
            </th>
          ))}
        </tr>

        {dataSource.sort((a, b) => {
          if (sortIndex === null) return 0;
          return sortColumn.sortFunc(a, b, sortOrder);
        }).map((data) => (
          rowLink ? (
            <Link key={data.key ?? nanoid(6)} href={rowLink(data)}>
              <a className={styles.rowLink}>
                <TableRow columns={columns} data={data} />
              </a>
            </Link>
          ) : (
            <TableRow columns={columns} data={data} />
          )
        ))}
      </table>
    </div>
  );
};

export default CTable;
