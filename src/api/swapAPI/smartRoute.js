import axios from 'axios';

async function calculateSmartRoute(amount, fromAsset, toAsset) {
  const response = await axios.post(`${process.env.REACT_APP_LUMEN_API}/smart-routing/quote`, {
    amount,
    from: fromAsset.code,
    to: toAsset.code,
  });
  return response.data;
}

export default calculateSmartRoute;
