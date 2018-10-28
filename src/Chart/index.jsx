import { createElement, PureComponent } from 'react';
import { bool, string, shape } from 'prop-types';
import Datafeed from '~/api';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default class TVChartContainer extends PureComponent {
  static propTypes = {
    symbol: string,
    interval: string,
    containerId: string,
    libraryPath: string,
    chartsStorageUrl: string,
    chartsStorageApiVersion: string,
    clientId: string,
    userId: string,
    fullscreen: bool,
    autosize: bool,
    studiesOverrides: shape({}),
  };

  static defaultProps = {
    symbol: 'Upbit:BTC/KRW',
    interval: '1D',
    containerId: 'tv_chart_container',
    libraryPath: '/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  componentDidMount() {
    const {
      symbol,
      interval,
      containerId,
      libraryPath,
      chartsStorageUrl,
      chartsStorageApiVersion,
      clientId,
      userId,
      fullscreen,
      autosize,
      studiesOverrides,
    } = this.props;

    const widgetOptions = {
      debug: false,
      symbol,
      datafeed: Datafeed,
      interval,
      timezone: 'Asia/Seoul',
      container_id: containerId,
      library_path: libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: chartsStorageUrl,
      charts_storage_api_version: chartsStorageApiVersion,
      client_id: clientId,
      user_id: userId,
      fullscreen,
      autosize,
      studies_overrides: studiesOverrides,
      overrides: {
        'mainSeriesProperties.showCountdown': true,
        'paneProperties.background': '#131722',
        'paneProperties.vertGridProperties.color': '#363c4e',
        'paneProperties.horzGridProperties.color': '#363c4e',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#AAA',
        'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
        'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
      },
    };

    window.TradingView.onready(() => {
      window.tvWidget = new window.TradingView.widget(widgetOptions);
      const widget = window.tvWidget;

      widget.onChartReady(() => {});
    });
  }

  render() {
    const { containerId } = this.props;

    return <div id={containerId} />;
  }
}
