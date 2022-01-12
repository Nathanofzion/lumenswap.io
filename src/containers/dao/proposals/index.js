import React from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';

import ServerSideLoading from 'components/ServerSideLoading';
import DAOHeader from 'containers/dao/DAOHeader';
import urlMaker from 'helpers/urlMaker';
import Breadcrumb from 'components/BreadCrumb';

import styles from './styles.module.scss';

const Proposals = () => {
  const router = useRouter();
  const Container = ({ children }) => (
    <div className="container-fluid">
      <Head>
        <title>proposals | Lumenswap</title>
      </Head>
      <DAOHeader />
      {children}
    </div>
  );

  const crumbData = [
    { url: urlMaker.dao.root(), name: 'Board' },
    { name: router.query.name },
  ];

  return (
    <Container>
      <ServerSideLoading>
        <div className={classNames('layout main', styles.layout)}>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">
              {/* <h1 className={styles.title}>Proposals</h1> */}
              <Breadcrumb
                spaceBetween={8}
                data={crumbData}
              />
              this is proposal
            </div>
          </div>
        </div>
      </ServerSideLoading>
    </Container>
  );
};

export default Proposals;
