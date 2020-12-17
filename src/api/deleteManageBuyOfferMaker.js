import store from 'src/store';
import { loginTypes } from 'src/reducers/user';
import deleteManageBuyOfferWithAlbedo from './deleteManageBuyOfferWithAlbedo';
import deleteManageBuyOfferWithPrivate from './deleteManageBuyOfferWithPrivate';
import deleteManageBuyOfferWithLedgerS from 'src/stellar-transactions/deleteManageBuyOfferWithLedgerS';
import deleteManageBuyOfferWithFreighter from 'src/stellar-transactions/deleteManageBuyOfferWithFreighter';

export default function deleteManageBuyOfferMaker(offer) {
  const { user } = store.getState();
  if (user.loginType === loginTypes.ALBEDO) {
    return deleteManageBuyOfferWithAlbedo(offer);
  } else if (user.loginType === loginTypes.PV) {
    return deleteManageBuyOfferWithPrivate(offer);
  } else if (user.loginType === loginTypes.LEDGER_S) {
    return deleteManageBuyOfferWithLedgerS(offer);
  } else if (user.loginType === loginTypes.FREIGHTER) {
    return deleteManageBuyOfferWithFreighter(offer);
  }
}
