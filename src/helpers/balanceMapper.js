import BN from 'helpers/BN';
import getAssetDetails from './getAssetDetails';

export default function balanceMapper(item) {
  const balance = new BN(item.balance)
    .minus(item.selling_liabilities)
    .toFixed(7);

  return {
    asset: getAssetDetails({
      code: item.asset_code,
      issuer: item.asset_issuer,
    }),
    balance,
    rawBalance: item.balance,
  };
}
