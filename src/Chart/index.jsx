import { createElement, Fragment, PureComponent } from 'react';
import { bool, string, shape, arrayOf, func } from 'prop-types';
import styled from 'styled-components';
import Dropdown from '@wonism/react-dropdown';
import Datafeed from '~/api';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  font-size: 0;

  & > div {
    padding: 10px 5px 10px 10px;
  }

  & + & {
    & > div {
      padding: 10px 10px 10px 5px;
    }
  }

  @media (max-width: 768px) {
    & + & {
      & > div {
        padding-top: 0;
      }
    }
  }
`;

const Chart = styled.div`
  margin: auto;
  padding: 10px;

  ${({ isMulti, closed }) => {
    if (isMulti) {
      if (closed) {
        return `
          width: calc(50vw - 15px);
          height: calc(100vh - 50px);

          @media (max-width: 768px) {
            width: calc(100vw - 20px);
            height: calc(50vh - 30px);
          }
        `;
      }

      return `
        width: calc(50vw - 15px);
        height: calc(100vh - 130px);

        @media (max-width: 768px) {
          width: calc(100vw - 20px);
          height: calc(50vh - 70px);

          &:nth-of-type(2) {
            padding-top: 0;
          }
        }
      `;
    }

    if (closed) {
      return `
        width: calc(100vw - 20px);
        height: calc(100vh - 50px);

        @media (max-width: 768px) {
          height: calc(100vh - 50px);
        }
      `;
    }

    return `
      width: calc(100vw - 20px);
      height: calc(100vh - 130px);
    `;
  }}
`;

const StyledDropdown = styled(Dropdown)`
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 4px 12px;
  max-height: 200px;
  color: #111;
  background-color: #fff;
  font-size: 14px;
  overflow-y: auto;
  z-index: 999;
  ${({ darkMode }) => (darkMode ? `
    color: #fff;
    background-color: rgba(19, 23, 23, .4);
    border: 1px solid #fff;
  ` : `
    color: #131722;
    background-color: rgba(255, 255, 255, .4);
    border: 1px solid #131722;
  `)}

  &.is-open {
    .Dropdown-control  {
      display: none;
    }
  }

  .Dropdown-option {
    padding: 4px 12px;
  }
`;

const Markets = ({ market, markets, changeMarket, darkMode }) => (
  <StyledDropdown
    options={markets}
    value={market}
    onChange={changeMarket}
    darkMode={darkMode}
  />
);

Markets.propTypes = {
  market: string.isRequired,
  markets: arrayOf(shape({
    base: string.isRequired,
    counter: string.isRequired,
    value: string.isRequired,
    label: string.isRequired,
  })).isRequired,
  changeMarket: func.isRequired,
  darkMode: bool.isRequired,
};

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default class TVChartContainer extends PureComponent {
  static propTypes = {
    closed: bool.isRequired,
    darkMode: bool.isRequired,
    isMulti: bool,
    markets: arrayOf(shape({
      base: string.isRequired,
      counter: string.isRequired,
      value: string.isRequired,
      label: string.isRequired,
    })).isRequired,
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
    isMulti: false,
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

  static widget = null;

  constructor(props) {
    super(props);

    const { symbol } = props;

    this.state = {
      symbol,
    };
  }

  componentDidMount() {
    const {
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
      darkMode,
    } = this.props;
    const { symbol } = this.state;

    const widgetOptions = {
      debug: false,
      symbol,
      theme: darkMode ? 'Dark' : 'Light',
      datafeed: Datafeed,
      interval,
      timezone: 'Asia/Seoul',
      container_id: containerId,
      library_path: libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: ['header_symbol_search', 'use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: chartsStorageUrl,
      charts_storage_api_version: chartsStorageApiVersion,
      client_id: clientId,
      user_id: userId,
      fullscreen,
      autosize,
      studies_overrides: studiesOverrides,
    };

    const { TradingView } = window;

    TVChartContainer.widget = new TradingView.widget(widgetOptions);
    TVChartContainer.widget.onChartReady(() => {});
  }

  componentDidUpdate(prevProps, prevState) {
    const { interval, darkMode } = this.props;
    const { symbol } = this.state;

    if (prevState.symbol !== symbol) {
      TVChartContainer.widget.setSymbol(symbol, interval, () => {});
    }

    if (prevProps.darkMode !== darkMode) {
      TVChartContainer.widget.changeTheme(darkMode ? 'Dark' : 'Light');
    }
  }

  changeMarket = ({ value }) => {
    const [counter, base] = value.split('-');

    this.setState({
      symbol: `Upbit:${base}/${counter}`,
    });
  };

  render() {
    const { closed, darkMode, isMulti, containerId, markets } = this.props;
    const { symbol } = this.state;
    const [, counter, base] = symbol.split(/[:/]/);

    return (
      <Wrapper>
        <Chart
          id={containerId}
          closed={closed}
          isMulti={isMulti}
        />
        <Markets
          markets={markets}
          market={`${base}-${counter}`}
          changeMarket={this.changeMarket}
          darkMode={darkMode}
        />
      </Wrapper>
    );
  }
}
