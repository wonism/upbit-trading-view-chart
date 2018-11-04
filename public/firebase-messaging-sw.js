importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js');

const config = {
  apiKey: 'AIzaSyBP67RbSONRWIKKkkQb1XixHxSo5sO3GHA',
  authDomain: 'upbit-trading-view.firebaseapp.com',
  databaseURL: 'https://upbit-trading-view.firebaseio.com',
  projectId: 'upbit-trading-view',
  storageBucket: 'upbit-trading-view.appspot.com',
  messagingSenderId: '780056023795',
};

firebase.initializeApp(config);
firebase.messaging();

/*
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
	const title = 'Hello World';
	const options = {
		body: `@@@@ ${payload.data.body}`,
	};

	return self.registration.showNotification(title, options);
});
*/
