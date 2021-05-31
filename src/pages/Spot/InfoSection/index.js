import { useState } from 'react';
// import Checkbox from 'components/Checkbox';
import CustomTabs from 'components/CustomTabs';
// import ButtonGroup from 'components/ButtonGroup';
import { useSelector } from 'react-redux';
import isEmpty from 'helpers/is-empty';
import FetchDataLoading from 'components/FetchDataLoading';
import OrderHistory from './OrderHistory';
import TradeHistory from './TradeHistory';

// const buttonGroupItems = [
//   { label: '1 Day', value: '1' },
//   { label: '1 Week', value: '7' },
//   { label: '1 Month', value: '30' },
//   { label: '3 Month', value: '90' },
// ];
// <ButtonGroup
//       buttons={buttonGroupItems}
//       activeIndex={0}
//       setValue={(v) => { console.log(v); }}
//     />

export default function InfoSection() {
  const [orderCounter, setOrderCounter] = useState(0);
  const [order, setOrder] = useState(null);
  const [trade, setTrade] = useState(null);
  const historyTab = [
    { title: `Open Orders(${orderCounter})`, id: 'order' },
    { title: 'Trade History', id: 'trade' },
  ];
  const isLogged = useSelector((state) => state.user.logged);
  const [currentTab, setCurrentTab] = useState('order');

  function TabContent() {
    if (!isLogged) {
      return <div style={{ minHeight: '150px' }}>Connect your wallet</div>;
    }

    if (isEmpty(trade) || isEmpty(order)) {
      return <div style={{ minHeight: '150px' }}><FetchDataLoading /></div>;
    }

    if (currentTab === 'order') {
      return <OrderHistory setOrderCounter={setOrderCounter} setOrder={setOrder} />;
    }

    if (currentTab === 'trade') {
      return <TradeHistory setTrade={setTrade} />;
    }

    return null;
  }

  return (
    <>
      {/* <div className={styles['container-checkbox']}>
        <Checkbox
          checked={checked}
          onChange={() => setCheckbox(!checked)}
          size={15}
          label="Hide other pairs"
        />
      </div> */}
      <div className="mt-md-0 mt-sm-4 mt-4">
        <CustomTabs
          tabs={historyTab}
          activeTabId={historyTab[0].id}
          fontSize={14}
          tabContent={() => null}
          onChange={(val) => {
            setCurrentTab(val);
          }}
        />
        <TabContent />
      </div>
    </>
  );
}
