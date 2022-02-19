import Link from 'next/link';
import classNames from 'classnames';
import humanizeAmount from 'helpers/humanizeAmount';
import urlMaker from 'helpers/urlMaker';
import { statusClassNames } from 'containers/auction/consts';
import styles from './styles.module.scss';

const STATUS_CLASSNAMES = statusClassNames(styles);

const AuctionBoardItem = ({ auction }) => (
  <Link href={urlMaker.auction.singleAuction.root(`${auction.title.toLowerCase()}`)} passHref>
    <a className="text-decoration-none">
      <div className={classNames(styles.box, 'mt-4')}>
        <div className="row">
          <div className="col-lg-4 col-md-12 col-sm-12 col-12 pr-lg-0 pr-md-3 pr-sm-3 pr-3">
            <div className={styles.banner}>
              <div
                className={
                  classNames(styles.status, STATUS_CLASSNAMES[auction.status.toLowerCase()])
                }
              >
                <span className={styles['status-circle']} />
                <span>{auction.status}</span>
              </div>
              {auction.image && (
                <div className={styles['title-container']}>
                  <div className={styles['img-container']}>
                    <img src={auction.image} width={82} height={82} />
                    <span className={styles['img-container-title']}>
                      {auction.assetCode}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-8 col-md-12 col-sm-12 col-12 pl-lg-0 pl-md-3 pl-sm-3 pl-3">
            <div className={styles.info}>
              <h6 className={styles['info-title']}>{auction.title}({auction.assetCode})</h6>
              <p className={styles['info-desc']}>
                {auction.description}
              </p>
              <div className={styles.badges}>
                <div className={styles.badge}>
                  <span className={styles['badge-subject']}>Amount to sell</span>{humanizeAmount(auction.amountToSell)} {auction.assetCode}
                </div>
                <div className={styles.badge}>
                  <span className={styles['badge-subject']}>Base price</span>{`${auction.basePrice} XLM`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  </Link>
);

export default AuctionBoardItem;
