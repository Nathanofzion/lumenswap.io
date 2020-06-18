import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { orderPages, homePage, modalPage } from 'src/constants/routes';
import Orders from './Orders';
import Exchange from './Exchange';
import ModalPage from './ModalPage';
import Modal from './Modal';
import 'rc-switch/assets/index.css';
import 'src/styles/base.less';

export default () => (
  <>
    <Modal />
    <Switch>
      <Route path={orderPages} exact component={Orders} />
      <Route path={homePage} exact component={Exchange} />
      <Route path={modalPage} exact component={ModalPage} />
      <Route path="/:fromCustomAsset/:toCustomAsset" exact component={Exchange} />
    </Switch>
  </>
);
