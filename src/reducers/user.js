import types from 'src/actions';

const defaultState = {
  logged: false,
  detail: {},
};

export const loginTypes = {
  PV: 'private_key',
  ALBEDO: 'albedo_link',
  LEDGER_S: 'LEDGER_S',
  TREZOR: 'TREZOR',
  FREIGHTER: ' FREIGHTER',
  RABET: 'RABET',
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.user.LOGIN: {
      return {
        logged: true,
        loginType: action.loginType,
        detail: action.detail,
      };
    }

    case types.user.LOGOUT: {
      return { logged: false, detail: {} };
    }

    default: {
      return state;
    }
  }
};
