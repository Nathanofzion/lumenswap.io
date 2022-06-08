import { useRef, useEffect } from 'react';
import { getAssetDetails } from 'helpers/asset';
import moment from 'moment';
import useCurrentTheme from 'hooks/useCurrentTheme';
import { widget } from '../../../../../public/static/charting_library/charting_library';
import { tvChartTrageAggregator } from './utils';

const defaultChartProps = {
  containerId: 'tv_chart_container',
  libraryPath: '/static/charting_library/',
};

const configurationData = {
  supported_resolutions: ['1', '5', '15', '1H', '1D', '1W'],
};

const reso = {
  1: 60000,
  5: 300000,
  15: 900000,
  60: 3600000,
  '1H': 3600000,
  '1D': 86400000,
  '1W': 604800000,
};

export default function TVChart({ appSpotPair }) {
  const tvWidget = useRef();
  const currentTheme = useCurrentTheme();

  useEffect(() => {
    const datafeed = {
      onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
      },
      resolveSymbol: (symbolName, onSymbolResolvedCallback) => {
        console.log('[resolveSymbol] called');
        onSymbolResolvedCallback({
          ticker: `${appSpotPair.base.getCode()}/${appSpotPair.counter.getCode()}`,
          symbol: `${appSpotPair.base.getCode()}/${appSpotPair.counter.getCode()}`,
          has_intraday: true,
          supported_resolutions: configurationData.supported_resolutions,
          session: '24x7',
        });
      },
      getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        const { to, from, firstDataRequest } = periodParams;

        let myTo = to;
        if (Date.now() < to * 1000) {
          myTo = moment().startOf('second').add(1, 'days').valueOf();
        }

        console.log('[getBars]: Method call', firstDataRequest, from, to, myTo);

        try {
          const res = await tvChartTrageAggregator(
            getAssetDetails(appSpotPair.base),
            getAssetDetails(appSpotPair.counter),
            myTo * 1000,
            200,
            reso[resolution],
          );

          if (res.length === 0) {
            onHistoryCallback([], { noData: true });
          } else {
            onHistoryCallback(res, { noData: false });
          }
        } catch (error) {
          onErrorCallback(error);
        }
      },

      subscribeBars: () => {
        console.log('sub');
      },

      unsubscribeBars: () => {
        console.log('unsub');
      },
    };

    const widgetOptions = {
      symbol: 'XLM/USDC',
      datafeed,
      container_id: defaultChartProps.containerId,
      library_path: defaultChartProps.libraryPath,
      autosize: true,
      disabled_features: [
        'header_symbol_search',
        'study_templates',
        'header_compare',
        'header_settings',
        'timeframes_toolbar',
      ],
      overrides: {
        'paneProperties.background': `${currentTheme === 'light' ? '#ffffff' : '#171b21'}`,
        'paneProperties.backgroundType': 'solid',
      },
      toolbar_bg: 'red',
      custom_css_url: 'lumenswap_style.css',
      theme: `${currentTheme === 'light' ? 'Light' : 'Dark'}`,
    };
    localStorage.removeItem('tradingview.current_theme.name');

    if (tvWidget.current) {
      tvWidget.current.remove();
    }

    tvWidget.current = new widget(widgetOptions);
  }, [appSpotPair.base, appSpotPair.counter, currentTheme]);

  return (
    <div
      style={{ height: 416 }}
      id={defaultChartProps.containerId}
    />
  );
}
