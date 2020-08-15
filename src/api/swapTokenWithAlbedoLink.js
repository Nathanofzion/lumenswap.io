import StellarSDK from 'stellar-sdk';
import store from 'src/store';
import getAssetDetails from 'src/helpers/getAssetDetails';
import hideModal from 'src/actions/modal/hide';
import showTxnStatus from 'src/actions/modal/transactionStatus';
import { trsStatus } from 'src/constants/enum';
import createManageBuyOffer from './createManageBuyOffer';
import reportSuccessfulSwap from './metrics/reportSuccessfulSwap';
import reportFailureSwap from './metrics/reportFailureSwap';
import albedo from '@albedo-link/intent';

const server = new StellarSDK.Server(process.env.REACT_APP_HORIZON);

export default async function swapTokenWithAlbedoLink() {
  const { checkout, userToken } = store.getState();

  try {
    let needToTrust;
    if (checkout.toAsset.issuer === 'native') {
      needToTrust = false;
    } else {
      needToTrust = !userToken.find(
        (token) =>
          token.asset_code === checkout.toAsset.code &&
          token.asset_issuer === checkout.toAsset.issuer
      );
    }

    const account = await server.loadAccount(checkout.fromAddress);
    const fee = await server.fetchBaseFee();

    let transaction = new StellarSDK.TransactionBuilder(account, {
      fee,
      networkPassphrase: StellarSDK.Networks.PUBLIC,
    });
    if (needToTrust) {
      transaction = transaction.addOperation(
        StellarSDK.Operation.changeTrust({
          asset: getAssetDetails(checkout.toAsset),
        })
      );
    }

    const path = [];
    if (
      !getAssetDetails(checkout.fromAsset).isNative() &&
      !getAssetDetails(checkout.toAsset).isNative()
    ) {
      path.push(new StellarSDK.Asset.native()); // eslint-disable-line
    }

    transaction = transaction
      .addOperation(
        StellarSDK.Operation.pathPaymentStrictSend({
          sendAsset: getAssetDetails(checkout.fromAsset),
          sendAmount: checkout.fromAmount.toFixed(7),
          destination: checkout.toAddress,
          destAsset: getAssetDetails(checkout.toAsset),
          destMin: (
            checkout.fromAmount *
            checkout.counterPrice *
            (1 - checkout.tolerance)
          ).toFixed(7),
          path,
        })
      )
      .setTimeout(30)
      .build();

    const result = await albedo.tx({
      xdr: transaction.toXDR(),
      submit: true,
    });

    hideModal();
    reportSuccessfulSwap();
    showTxnStatus({
      status: trsStatus.SUCCESS,
      message: result.result.hash,
      action: () => {
        global.window.open(
          `https://lumenscan.io/txns/${result.result.hash}`,
          '_blank'
        );
      },
    });
  } catch (error) {
    const e = {
      response: {
        data: error.ext,
      },
    };

    hideModal();
    reportFailureSwap();

    if (e?.response?.data?.extras?.result_codes?.operations) {
      const code = e.response.data.extras.result_codes.operations[1]
        ? e.response.data.extras.result_codes.operations[1]
        : e.response.data.extras.result_codes.operations[0];

      if (code === 'op_under_dest_min') {
        showTxnStatus({
          status: trsStatus.WARNING,
          message:
            'Your order is too large to be processed by the network. Do you want to register it as an active order on the network?',
          action: () => {
            createManageBuyOffer();
          },
        });
      } else if (code === 'op_underfunded') {
        showTxnStatus({
          status: trsStatus.FAIL,
          message: `You have not enough funds to send and still satisfy "${checkout.fromAsset.code}" selling liabilities, Note that if sending XLM then the you must additionally maintain its minimum XLM reserve.`,
        });
      } else {
        showTxnStatus({
          status: trsStatus.FAIL,
          message: `There is some issue in your transaction. reason: ${code}`,
        });
      }
    } else {
      showTxnStatus({
        status: trsStatus.FAIL,
        message: 'There is some issue in your transaction.',
      });
    }
  }
}
