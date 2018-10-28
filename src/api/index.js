import historyProvider from './historyProvider';
import stream from './stream';

const supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', 'D'];

const config = {
  supported_resolutions: supportedResolutions,
};

export default {
  onReady: (cb) => { setTimeout(() => cb(config), 0); },
  searchSymbols: (/* userInput, exchange, symbolType, onResultReadyCallback */) => {},
  resolveSymbol: (symbolName, onSymbolResolvedCallback /* , onResolveErrorCallback */) => {
    const [exchange, , base] = symbolName.split(/[:/]/);
    const symbolStub = {
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange,
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '60'],
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: 'streaming',
    };

    if (base.match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
      symbolStub.pricescale = 100;
    }

    setTimeout(() => {
      onSymbolResolvedCallback(symbolStub);
    }, 0);
  },
  getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    // 200 is the maximum candle counts for API request
    const bars = await historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest, 200);

    if (bars.length) {
      onHistoryCallback(bars, { noData: false });
    } else {
      onHistoryCallback(bars, { noData: true });
    }
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
    stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback);
  },
  unsubscribeBars: (subscriberUID) => {
    stream.unsubscribeBars(subscriberUID);
  },
  calculateHistoryDepth: resolution => (resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined),
  getMarks: (/* symbolInfo, startDate, endDate, onDataCallback, resolution */) => {},
  getTimeScaleMarks: (/* symbolInfo, startDate, endDate, onDataCallback, resolution */) => {},
  getServerTime: (/* cb */) => {},
};
