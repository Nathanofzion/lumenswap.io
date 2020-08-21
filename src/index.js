import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './views';
import store from './store';
import fetchUserBalance from './api/fetchUserBalance';
import setToken from './actions/setToken';
import lumenTokensSet from './actions/lumenTokens/set';
import defaultTokens from './tokens/defaultTokens';

setInterval(() => {
  const detail = store.getState().user.detail;
  if (detail.publicKey) {
    fetchUserBalance(detail.publicKey)
      .then((balances) => {
        setToken(balances);
      })
      .catch(() => {
        setToken([]);
      });
  }
}, 2000);

lumenTokensSet(defaultTokens);

ReactDOM.render(<App />, global.document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
