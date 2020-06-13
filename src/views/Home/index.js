import React from 'react';
import BaseLayout from 'Root/shared/components/Layout/BaseLayout';
import { activeOrderTHeader, completeOrderTHeader } from 'Root/constants/valus';
import Table from 'Root/shared/components/Table';
import TableInfo from 'Root/shared/components/TableInfo';
import styles from './styles.less';

const Home = (props) => {
  const activeTableRows = [];
  const completeTableRows = [];
  [0, 1, 2, 3, 4, 5].map((item) => {
    activeTableRows.push(
      <tr>
        <td>0x401b914336…078ff425697f8</td>
        <td>1 BTC - amir.com</td>
        <td>14 ETH - apay.com</td>
        <td width="18%" className="td-light">2 min ago</td>
        <td width="8%"><button type="button" className={styles.cancel}>Cancel</button></td>
      </tr>,
    );
  });

  [0, 1, 2, 3, 4, 5].map((item) => {
    completeTableRows.push(
      <tr>
        <td>1 BTC - amir.com</td>
        <td>14 ETH - apay.com</td>
        <td className="td-light">2 min ago</td>
      </tr>,
    );
  });

  return (
    <BaseLayout>
      <div className="pb-5 mb-2">
        <TableInfo title="Active orders" link="/" style={{ marginTop: '42px' }} className="mb-2" />
        <Table tableRows={activeTableRows} tableHead={activeOrderTHeader} />
        <TableInfo title="Complete orders" link="/" style={{ marginTop: '42px' }} className="mb-2" />
        <Table tableRows={completeTableRows} tableHead={completeOrderTHeader} />
      </div>
    </BaseLayout>
  );
};

Home.propTypes = {

};

export default Home;
