import { createElement, PureComponent, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import Chart from '~/Chart';
import Donate from '~/Donate';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');

  body {
    margin: 0;
    padding: 0;
    line-height: 20px;
    font-size: 16px;
    text-align: center;
  }
`;

export default class App extends PureComponent {
  state = {
    closed: false,
  };

  handleClick = () => {
    const { closed } = this.state;

    this.setState({ closed: !closed });
  };

  render() {
    const { closed } = this.state;

    return (
      <>
        <Helmet>
          <title>Upbit Trading View Chart</title>
          <meta charSet="utf-8" />
          <meta name="description" content="Upbit Trading View Chart" />
        </Helmet>
        <Chart closed={closed} />
        <Donate closed={closed} handleClick={this.handleClick} />
        <GlobalStyle />
      </>
    );
  }
}
