import { createElement, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import Chart from '~/Chart';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const App = () => (
  <>
    <Helmet>
      <title>Upbit Trading View Chart</title>
      <meta charSet="utf-8" />
      <meta name="description" content="Upbit Trading View Chart" />
    </Helmet>
    <Chart />
    <GlobalStyle />
  </>
);

export default App;
