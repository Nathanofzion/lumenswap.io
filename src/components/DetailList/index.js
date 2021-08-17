import { fetchTradeAggregationAPI } from 'api/stellar';
import classNames from 'classnames';
import numeral from 'numeral';
import BN from 'helpers/BN';
import minimizeAddress from 'helpers/minimizeAddress';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

const DetailList = ({ appSpotPair, price }) => {
  const [detailData, setDetailData] = useState([
    { title: '24 Change', value: '-', status: 'buy' },
    { title: '24 High', value: '-' },
    { title: '24 Low', value: '-' },
    { title: `24 Volume (${appSpotPair.base.getCode()})`, value: '-' },
    { title: `24 Volume (${appSpotPair.counter.getCode()})`, value: '-' },
    {
      title: `${appSpotPair.base.getCode()} asset issuer`,
      value: appSpotPair.base.getIssuer() ? minimizeAddress(appSpotPair.base.getIssuer()) : 'Stellar Foundation',
      status: appSpotPair.base.getIssuer() ? 'link' : false,
      link: appSpotPair.base.getIssuer()
        ? `${process.env.REACT_APP_LUMENSCAN_URL}/assets/${appSpotPair.base.getCode()}-${appSpotPair.base.getIssuer()}`
        : false,
    },
    {
      title: `${appSpotPair.counter.getCode()} asset issuer`,
      value: appSpotPair.counter.getIssuer() ? minimizeAddress(appSpotPair.counter.getIssuer()) : 'Stellar Foundation',
      status: appSpotPair.counter.getIssuer() ? 'link' : false,
      link: appSpotPair.counter.getIssuer()
        ? `${process.env.REACT_APP_LUMENSCAN_URL}/assets/${appSpotPair.counter.getCode()}-${appSpotPair.counter.getIssuer()}`
        : false,
    },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const tradeData = await fetchTradeAggregationAPI(appSpotPair.base, appSpotPair.counter, {
          end_time: Date.now(),
          start_time: Date.now() - (60 * 60 * 24 * 1000),
          resolution: 900000,
          limit: 96,
          offset: 0,
          order: 'desc',
        });

        const firstChunk = tradeData.data._embedded.records[0];
        const aggregatedData = tradeData.data._embedded.records.reduce((acc, current, index) => {
          acc.baseVolume = acc.baseVolume.plus(current.base_volume);
          acc.counterVolume = acc.counterVolume.plus(current.counter_volume);

          if (new BN(current.low).isLessThan(acc.low)) {
            acc.low = new BN(current.low);
          }

          if (new BN(current.high).isGreaterThan(acc.high)) {
            acc.high = new BN(current.high);
          }

          if (index === 0) {
            acc.currentPrice = current.close;
          }

          if (index + 1 === tradeData.data._embedded.records.length) {
            acc.last24hPrice = current.open;
          }

          return acc;
        }, {
          baseVolume: new BN(0),
          counterVolume: new BN(0),
          high: new BN(firstChunk ? firstChunk.high : 0),
          low: new BN(firstChunk ? firstChunk.low : Infinity),
          currentPrice: new BN(0),
          last24hPrice: new BN(0),
        });

        const ch24 = (new BN(aggregatedData.currentPrice).minus(aggregatedData.last24hPrice))
          .div(aggregatedData.last24hPrice).times(100);

        setDetailData([
          { title: '24 Change', value: `${ch24.toFixed(2)}%`, status: ch24.gte(0) ? 'buy' : 'sell' },
          { title: '24 High', value: numeral(aggregatedData.high.toString()).format('0.0[00]a') },
          { title: '24 Low', value: numeral(aggregatedData.low.toString()).format('0.0[00]a') },
          { title: `24 Volume (${appSpotPair.base.getCode()})`, value: numeral(aggregatedData.baseVolume.toString()).format('0.0a') },
          { title: `24 Volume (${appSpotPair.counter.getCode()})`, value: numeral(aggregatedData.counterVolume.toString()).format('0.0a') },
          {
            title: `${appSpotPair.base.getCode()} asset issuer`,
            value: appSpotPair.base.getIssuer() ? minimizeAddress(appSpotPair.base.getIssuer()) : 'Stellar Foundation',
            status: appSpotPair.base.getIssuer() ? 'link' : false,
            link: appSpotPair.base.getIssuer()
              ? `${process.env.REACT_APP_LUMENSCAN_URL}/assets/${appSpotPair.base.getCode()}-${appSpotPair.base.getIssuer()}`
              : false,
          },
          {
            title: `${appSpotPair.counter.getCode()} asset issuer`,
            value: appSpotPair.counter.getIssuer() ? minimizeAddress(appSpotPair.counter.getIssuer()) : 'Stellar Foundation',
            status: appSpotPair.counter.getIssuer() ? 'link' : false,
            link: appSpotPair.counter.getIssuer()
              ? `${process.env.REACT_APP_LUMENSCAN_URL}/assets/${appSpotPair.counter.getCode()}-${appSpotPair.counter.getIssuer()}`
              : false,
          },
        ]);
      } catch (e) {
        console.error(e);
      }
    }

    loadData();
  }, [appSpotPair.base, appSpotPair.counter]);

  const setStatusStyle = (status) => {
    if (status === 'buy') {
      return 'color-buy';
    }

    if (status === 'sell') {
      return 'color-sell';
    }
    return null;
  };

  return (
    <div className="row">
      {[{ title: 'Price', value: `${price} ${appSpotPair.counter.getCode()}` },
        ...detailData,
      ].map((item, index) => (
        <div
          className={classNames('col-auto mb-lg-0 mb-md-1 mb-sm-1 mb-1',
            styles.col, (item.status === 'bold') && styles.bold)}
          key={index}
        >
          <div className={styles.title}>{item.title}</div>
          {item.status === 'link'
            ? (
              <a
                className={classNames(styles.value, styles.link)}
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >{item.value} <span className="icon-external" />
              </a>
            )
            : (
              <div className={classNames(styles.value, setStatusStyle(item.status))}>

                {item.value}
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default DetailList;
