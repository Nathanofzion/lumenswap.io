import OffersData from './OffersData';
import TradesData from './TradesData';

const SingleItemTabContent = ({ tab, itemData, offers }) => {
  if (tab === 'offer') {
    return (
      <OffersData offers={offers} />
    );
  }
  return (
    <TradesData itemData={itemData} />
  );
};

export default SingleItemTabContent;
