import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import CChart from 'components/CChart';
import Loading from 'components/Loading';
import humanAmount from 'helpers/humanAmount';
import BN from 'helpers/BN';
import styles from './styles.module.scss';

const ChartLoading = () => (
  <div className={styles['loading-container-chart']}>
    <Loading size={48} />
  </div>
);

function VolumeChart({ options, setCurrentVolume, chartData }) {
  return (
    <CChart
      options={options}
      onEvents={{
        mouseover: (params) => setCurrentVolume(chartData[params.dataIndex]),
        mouseout: () => setCurrentVolume(chartData[chartData.length - 1]),
      }}
      height="117px"
    />
  );
}

const InnerChartMemo = React.memo(VolumeChart);

function AMMOVerallVolumeChart({ chartData }) {
  const [currentVolume, setCurrentVolume] = useState({
    tvl: 0,
    volume: 0,
  });

  const volumeOptions = useMemo(() => ({
    // tooltip: {},
    dataZoom: {
      start: 0,
      end: 100,
      type: 'inside',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter() {
        return null;
      },
    },
    xAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: '#656872',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: (val) => moment(val).utc().format('DD'),
      },
      data: chartData?.map((i) => i.periodTime),
      splitLine: {
        show: false,
      },
    },
    yAxis: { show: false, splitLine: { show: false } },
    series: [
      {
        name: 'volume',
        type: 'bar',
        barWidth: 2,
        barGap: '100%',
        data: chartData?.map((i) => i.volume),
        itemStyle: {
          color: '#0e41f5', borderColor: '#fff', borderWidth: 0,
        },
        emphasis: {
          focus: 'series',
        },
        animationDelay(idx) {
          return idx * 10;
        },
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate(idx) {
      return idx * 5;
    },
  }), [chartData]);

  useEffect(() => {
    if (chartData !== null) {
      setCurrentVolume(chartData[chartData.length - 1]);
    }
  }, [chartData]);

  if (!volumeOptions) {
    return <ChartLoading />;
  }

  return (
    <div className="col-md-6 col-12">
      <div className={styles['chart-container']}>
        <div className={styles['chart-info-container']}>
          <div className={styles['volume-chart']}>
            <span className={styles['volume-chart-number']}>${humanAmount(new BN(currentVolume.volume).div(10 ** 7).toString(), true)}</span>
            <span className={styles['volume-chart-text']}>Volume 24h</span>
          </div>
        </div>
        <div className={styles.chart}>
          <InnerChartMemo
            options={volumeOptions}
            setCurrentVolume={setCurrentVolume}
            chartData={chartData}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(AMMOVerallVolumeChart);
