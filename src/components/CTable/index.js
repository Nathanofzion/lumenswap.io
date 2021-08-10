import React from 'react';
import { nanoid } from 'nanoid';
import styles from './styles.module.scss';

const CTable = ({ columns, dataSource, className }) => (
  <div className={styles['table-container']}>
    <table className={className ?? styles.table}>

      <tr className={styles['header-table']}>
        {columns.map((title) => (
          <th
            style={title.style ?? { width: `${100 / columns.length}%` }}
            key={title.key}
          >
            <span>{title.title}</span>
          </th>
        ))}
      </tr>

      {dataSource.map((data) => (
        <tr className={styles.row} key={data.key ?? nanoid(6)}>
          {columns.map((column) => (
            <td
              className={styles['row-item']}
            >
              <span>
                {column.render
                  ? column.render(data)
                  : data[column.dataIndex]}
              </span>
            </td>
          ))}
        </tr>
      ))}

    </table>
  </div>

);
export default CTable;
