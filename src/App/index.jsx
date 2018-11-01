import { createElement, PureComponent, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import Chart from '~/Chart';
import Donate from '~/Donate';
import Button from '~/Button';

const apiRoot = 'https://api.upbit.com/v1';
const marketPathname = '/market/all';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');

  body {
    margin: 0;
    padding: 0;
    line-height: 20px;
    font-size: 16px;
    text-align: center;
    ${({ darkMode }) => (darkMode ? `
      color: #fff;
      background-color: #131722;
    ` : `
      color: #131722;
      background-color: #fff;
    `)}
  }
`;

export default class App extends PureComponent {
  state = {
    closed: false,
    isMulti: false,
    darkMode: true,
    failed: false,
    fetched: false,
    markets: [],
  };

  componentDidMount() {
    this.fetchMarkets();
  }

  fetchMarkets = async () => {
    const response = await fetch(`${apiRoot}${marketPathname}`);

    if (response.ok) {
      const result = await response.json();
      const markets = result.map(({ market: value }) => {
        const [base, counter] = value.split('-');

        return {
          value,
          label: value,
          base,
          counter,
        };
      });

      this.setState({
        fetched: true,
        markets,
      });
    } else {
      this.setState({
        failed: true,
      });
    }
  };

  showMultipleCharts = () => {
    const { isMulti } = this.state;

    this.setState({ isMulti: !isMulti });
  };

  handleClick = () => {
    const { closed } = this.state;

    this.setState({ closed: !closed });
  };

  reloadMarkets = () => {
    this.fetchMarkets();
  };

  changeTheme = () => {
    const { darkMode } = this.state;

    this.setState({ darkMode: !darkMode });
  };

  render() {
    const { isMulti, closed, darkMode, failed, fetched, markets } = this.state;

    return (
      <>
        <Helmet>
          <title>Upbit Trading View Chart</title>
          <meta charSet="utf-8" />
          <meta name="description" content="Upbit Trading View Chart" />
        </Helmet>
        {isMulti ? (
          <>
            <Chart
              containerId="chart-1"
              closed={closed}
              markets={markets}
              darkMode={darkMode}
              isMulti
            />
            <Chart
              containerId="chart-2"
              closed={closed}
              markets={markets}
              darkMode={darkMode}
              isMulti
            />
          </>
        ) : (
          <Chart
            containerId="chart-1"
            closed={closed}
            markets={markets}
            darkMode={darkMode}
          />
        )}
        {!fetched && failed ? (
          <Button type="button" onClick={this.reloadMarkets} darkMode={darkMode}>
            마켓 리스트 다시 불러오기
          </Button>
        ) : null}
        <Button type="button" onClick={this.showMultipleCharts} darkMode={darkMode}>
          멀티 차트
        </Button>
        <Button type="button" onClick={this.changeTheme} darkMode={darkMode}>
          테마 변경(흑/백)
        </Button>
        <Donate closed={closed} handleClick={this.handleClick} darkMode={darkMode} />
        <GlobalStyle darkMode={darkMode} />
      </>
    );
  }
}
