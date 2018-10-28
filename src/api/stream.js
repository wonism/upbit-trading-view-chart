import historyProvider from './historyProvider';

export const createChannelString = (symbolInfo) => {
  const [, counter, base] = symbolInfo.name.split(/[:/]/);
  return `[{"ticket":"UNIQUE_TICKET"},{"type":"trade","codes":["${base}-${counter}"]}]`;
};

export const updateBar = (resolution, lastBar, data) => {
  const coeff = resolution.includes('D')
    ? (1440 * 60 * 1000)
    : resolution.includes('W')
      ? (10080 * 60 * 1000)
      : (resolution * 60 * 1000);

  const rounded = Math.floor(data.time / coeff) * coeff;
  const lastBarSec = lastBar.time;

  if (rounded > lastBarSec) {
    const newBar = {
      time: rounded,
      open: lastBar.close,
      high: lastBar.close,
      low: lastBar.close,
      close: data.price,
      volume: data.volume,
    };

    return newBar;
  }

  if (data.price < lastBar.low) {
    const updatedBar = {
      ...lastBar,
      low: data.price,
      close: data.price,
      volume: lastBar.volume + data.volume,
    };

    return updatedBar;
  }

  if (data.price > lastBar.high) {
    const updatedBar = {
      ...lastBar,
      high: data.price,
      close: data.price,
      volume: lastBar.volume + data.volume,
    };

    return updatedBar;
  }

  const updatedBar = {
    ...lastBar,
    close: data.price,
    volume: lastBar.volume + data.volume,
  };

  return updatedBar;
};

let ws;

export default {
  subscribeBars(symbolInfo, resolution, updateCb, uid /* , resetCache */) {
    const channelString = createChannelString(symbolInfo);
    const socketUrl = 'wss://api.upbit.com/websocket/v1';
    ws = new WebSocket(socketUrl);

    ws.endpoint = socketUrl;
    ws.onopen = () => {
      ws.send(channelString);
    };
    ws.onclose = () => {};
    ws.onerror = () => { alert('error'); };
    ws.onmessage = (message) => {
      const reader = new FileReader();

      reader.onload = () => {
        const parsedMessage = JSON.parse(reader.result);
        const data = {
          time: parsedMessage.trade_timestamp,
          price: parsedMessage.trade_price,
          volume: parsedMessage.trade_volume,
        };

        const { lastBar } = historyProvider.history[symbolInfo.name];
        const updatedBar = updateBar(resolution, lastBar, data);

        historyProvider.history[symbolInfo.name].lastBar = updatedBar;
        updateCb(updatedBar);
      };

      reader.readAsText(message.data);
    };
  },
  unsubscribeBars() {
    ws.close();
  },
};
