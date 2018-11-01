import 'babel-polyfill';
import 'whatwg-fetch';
import '~/pwa';
import { createElement } from 'react';
import { render } from 'react-dom';
import firebase from 'firebase/app';
import App from '~/App';

const config = {
  apiKey: 'AIzaSyBP67RbSONRWIKKkkQb1XixHxSo5sO3GHA',
  authDomain: 'upbit-trading-view.firebaseapp.com',
  databaseURL: 'https://upbit-trading-view.firebaseio.com',
  projectId: 'upbit-trading-view',
  storageBucket: 'upbit-trading-view.appspot.com',
  messagingSenderId: '780056023795',
};

firebase.initializeApp(config);

render(<App />, document.getElementById('app-root'));
