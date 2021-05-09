import SpotList from 'components/SpotList';

const orderListHeader = ['Price (USDC)', 'Amounr(XLM)', 'Total'];
const orderListItems = Array(17).fill({
  data: ['0.001238', '97', '0.12009'],
  progress: 1,
  status: 'sell',
}).concat(Array(17).fill(
  {
    data: ['0.001238', '92', '0.12009'],
    progress: 1,
    status: 'buy',
  },
));

const OrderSection = () => (
  <SpotList
    type="order"
    headerItem={orderListHeader}
    items={orderListItems}
    gapInfo={{
      index: 17, status: 'buy', total: '0.001219', price: '$34.76',
    }}
  />
);

export default OrderSection;
