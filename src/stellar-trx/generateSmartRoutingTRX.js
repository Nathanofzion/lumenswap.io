import StellarSDK from 'stellar-sdk';
import { getAssetDetails } from 'helpers/asset';
import BN from 'helpers/BN';
import transactionConsts from './consts';

const server = new StellarSDK.Server(process.env.REACT_APP_HORIZON);

export default async function generateSmartRoutingTRX({ checkout, needToTrust }) {
  const account = await server.loadAccount(checkout.fromAddress);

  let transaction = new StellarSDK.TransactionBuilder(account, {
    fee: transactionConsts.FEE,
    networkPassphrase: StellarSDK.Networks.PUBLIC,
  });
  const toAssetDetail = getAssetDetails(checkout.to.asset.details);

  if ((needToTrust) && !toAssetDetail.isNative()) {
    transaction = transaction.addOperation(
      StellarSDK.Operation.changeTrust({
        asset: toAssetDetail,
      }),
    );
  }

  for (const path of checkout.smartRoutePath) {
    const sendAsset = path.route[0][0];
    const destAsset = path.route[path.route.length - 1][1];

    const operationPath = [];
    for (let i = 0; i < path.route.length - 1; i = i + 1) {
      operationPath.push(path.route[i][1]);
    }

    transaction = transaction.addOperation(StellarSDK.Operation.pathPaymentStrictSend({
      sendAsset,
      destAsset,
      sendAmount: new BN(path.amount).div(10 ** 7).toFixed(7),
      path: [],
      destination: checkout.toAddress,
      destMin: new BN(path.outcome).div(10 ** 7)
        .times(new BN(1).minus(new BN(checkout.priceSpread).div(100))).toFixed(7),
    }));
  }

  transaction = transaction.setTimeout(transactionConsts.TIMEOUT)
    .build();

  return transaction;
}
