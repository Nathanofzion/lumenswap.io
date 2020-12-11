import store from 'src/store';
import { loginTypes } from 'src/reducers/user';
import createManageBuyOfferWithAlbedo from './createManageBuyOfferWithAlbedo';
import createManageBuyOfferWithPrivate from './createManageBuyOfferWithPrivate';
import createManageBuyOfferWithLedgerS from 'src/stellar-transactions/createManageBuyOfferWithLedgerS';

export default function createManageBuyOfferMaker() {
  const { user } = store.getState();
  if (user.loginType === loginTypes.ALBEDO) {
    createManageBuyOfferWithAlbedo();
  } else if (user.loginType === loginTypes.PV) {
    createManageBuyOfferWithPrivate();
  } else if (user.loginType === loginTypes.LEDGER_S) {
    createManageBuyOfferWithLedgerS();
  }
}
