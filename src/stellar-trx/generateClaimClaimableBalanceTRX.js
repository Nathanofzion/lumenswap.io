import StellarSDK from 'stellar-sdk';
import transactionConsts from './consts';

const server = new StellarSDK.Server(process.env.REACT_APP_HORIZON);

export default async function generateClaimableBalanceTRX(
  address,
  balanceId,
) {
  const account = await server.loadAccount(address);

  let transaction = new StellarSDK.TransactionBuilder(account, {
    fee: transactionConsts.FEE,
    networkPassphrase: StellarSDK.Networks.PUBLIC,
  });

  transaction = transaction.addOperation(
    StellarSDK.Operation.claimClaimableBalance({
      balanceId,
    }),
  );

  transaction = transaction.setTimeout(transactionConsts.TIMEOUT).build();

  return transaction;
}
