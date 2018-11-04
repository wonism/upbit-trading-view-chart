import 'babel-polyfill';
import 'whatwg-fetch';
import { createElement } from 'react';
import { render } from 'react-dom';
import App from '~/App';

/*
setTimeout(() => {
  (async function () {
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'key=AAAAtZ72UvM:APA91bFOa6HxpNcMtckhZURy0d99-c62F5_DfoFG0QQWx1oxpapJshTn-gDujwBHaK5B1ODwoJ32xcF14mQY1Ljq-nidTNU0EJaKHDN1z_fEP5WrEk1pNYdGAUlpM0cAilygn0yW9iTE',
      },
      body: JSON.stringify({
        notification: {
          title: 'Hello',
          body: 'World',
        },
        to: localStorage.getItem('user-token'),
      }),
    });
  })();
}, 2000);
*/

render(<App />, document.getElementById('app-root'));
