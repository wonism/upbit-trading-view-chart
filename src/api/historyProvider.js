const apiRoot = 'https://api.upbit.com/v1';
const history = {};

const parseDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = `${date.getFullYear()}`;
  const month = `${date.getMonth() + 1}`;
  const day = `${date.getDate()}`;
  const hour = `${date.getHours()}`;
  const minute = `${date.getMinutes()}`;
  const second = `${date.getSeconds()}`;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}.000Z`;
};

export default {
  history,
  getBars: async (symbolInfo, resolution, _from, _to, first, limit) => {
    const [, counter, base] = symbolInfo.name.split(/[:/]/);
    const pathname = resolution.includes('1D')
      ? '/candles/days'
      : resolution < 60
        ? '/candles/minutes/1'
        : '/candles/minutes/60';
    const to = first ? '' : `&to=${parseDate(history[symbolInfo.name].prev)}`;
    const url = `${apiRoot}${pathname}?market=${base}-${counter}&count=${limit}${to}`;

    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    const result = await response.json();

    if (!result.length) {
      return [];
    }

    const bars = result.map(({
      candle_date_time_kst: time,
      opening_price: open,
      high_price: high,
      low_price: low,
      trade_price: close,
      candle_acc_trade_volume: volume,
    }) => ({
      time: Number(new Date(time)),
      open,
      high,
      low,
      close,
      volume,
    })).reverse();

    if (first) {
      const lastBar = bars[bars.length - 1];
      history[symbolInfo.name] = { lastBar };
    }

    history[symbolInfo.name].prev = result[result.length - 1].candle_date_time_utc;

    return bars;
  },
};
