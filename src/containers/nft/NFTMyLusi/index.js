import Head from 'next/head';
import classNames from 'classnames';
import ItemThumbnail from 'containers/nft/ItemThumbnail';
import Loading from 'components/Loading';
import urlMaker from 'helpers/urlMaker';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useIsLogged from 'hooks/useIsLogged';
import BN from 'helpers/BN';
import NoData from 'components/NoData';
import CCard from 'components/CCard';
import ServerSideLoading from 'components/ServerSideLoading';
import { getMyNfts } from 'api/nft';
import NFTHeader from '../NFTHeader';
import styles from './styles.module.scss';

const Container = ({ children }) => (
  <div className="container-fluid">
    <Head>
      <title>My Items | Lumenswap</title>
    </Head>
    <NFTHeader />
    {children}
  </div>
);

const NFTCollections = () => {
  const [myItems, setMyItems] = useState(null);
  const userBalances = useSelector((state) => state.userBalance);
  const isLogged = useIsLogged();

  const router = useRouter();

  useEffect(() => {
    if (!isLogged) {
      router.push(urlMaker.nft.root());
    }
  }, [isLogged]);

  useEffect(() => {
    const items = userBalances
      .filter((i) => i.asset.issuer === process.env.REACT_APP_LUSI_ISSUER
      && new BN(i.rawBalance).isGreaterThan(0))
      .map((i) => ({ code: i.asset.code, issuer: i.asset.issuer }));
    getMyNfts(items).then((nfts) => {
      setMyItems(nfts);
    });
  }, []);

  if (!myItems) {
    return (
      <Container>
        <div className={styles['loading-container']}>
          <Loading size={48} />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <ServerSideLoading>
        <div className={classNames('layout main', styles.main)}>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12 col-12">

              <h1 className={styles.title}>My Items</h1>

              <div className={classNames('row', styles.row)}>
                {myItems.length === 0 && (
                <CCard className={styles['no-data-card']}>
                  <NoData message="You have no item." />
                </CCard>
                )}
                {myItems?.map((item) => (
                  <div
                    key={item.id}
                    className={classNames('col-xl-3 col-lg-4 col-md-4 col-sm-4 col-12', styles.col, styles['no-data-card'])}
                  >
                    <ItemThumbnail
                      name={`${item.itemName}-${item.number}`}
                      imgSrc={item.imageUrl}
                      price={item.price}
                      url={urlMaker.nft.item.root(item.slug, item.number)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ServerSideLoading>
    </Container>
  );
};

export default NFTCollections;
