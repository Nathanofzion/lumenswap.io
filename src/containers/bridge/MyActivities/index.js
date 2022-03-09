import { useEffect, useState } from 'react';
import BridgeContainer from 'containers/bridge/BridgeContainer';
import classNames from 'classnames';
import CPagination from 'components/CPagination';
import CTable from 'components/CTable';
import ArrowRight from 'assets/images/arrowRight';
import urlMaker from 'helpers/urlMaker';
import moment from 'moment';
import getUserActivities from 'api/mockAPI/bridgeUserActivities';
import useUserAddress from 'hooks/useUserAddress';
import humanizeAmount from 'helpers/humanizeAmount';
import useRequiredLogin from 'hooks/useRequiredLogin';
import styles from './styles.module.scss';
import StatusLabel from './StatusLabel';

const userActivityTableHeaders = [
  {
    title: 'Order ID',
    dataIndex: 'id',
    key: '1',
    render: (activityInfo) => `${activityInfo.orderID}`,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: '2',
    render: (activityInfo) => `${moment(activityInfo.date).fromNow()}`,
  },
  {
    title: 'Amount',
    dataIndex: 'date',
    key: '3',
    render: (activityInfo) => (
      <div className={styles['col-amount']}>
        {humanizeAmount(activityInfo.asset1.amount)} {activityInfo.asset1.code}
        <ArrowRight />
        {humanizeAmount(activityInfo.asset2.amount)} {activityInfo.asset2.code}
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'date',
    key: '4',
    render: (activityInfo) => <StatusLabel status={activityInfo.status} />,
  },
];
const singleActivityURLGenerator = (rowData) => urlMaker.bridge.activity.detail(rowData.orderID);

const MyActivities = () => {
  const [userActivities, setUserActivities] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const userAddress = useUserAddress();
  useRequiredLogin(urlMaker.bridge.root());

  useEffect(() => {
    setUserActivities(null);
    getUserActivities(userAddress, { currentPage }).then((activitiyData) => {
      setUserActivities(activitiyData.activities);
      setPages(activitiyData.totalPages);
    });
  }, [currentPage]);
  return (
    <BridgeContainer title="Bridge Activity | Lumenswap">
      <div className={classNames('layout main', styles.layout)}>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">
            <h1 className={styles.title}>My activities</h1>

            <div className={styles.card}>
              <CTable
                className={styles.table}
                columns={userActivityTableHeaders}
                dataSource={userActivities}
                loading={!userActivities}
                noDataMessage="There is no activity"
                rowFix={{ rowNumbers: 10, rowHeight: 53, headerRowHeight: 30 }}
                rowLink={singleActivityURLGenerator}
              />
            </div>

            <div className="d-flex mt-4">
              <CPagination
                pages={pages}
                currentPage={currentPage}
                onPageClick={(newPage) => {
                  setCurrentPage(newPage);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </BridgeContainer>
  );
};

export default MyActivities;
