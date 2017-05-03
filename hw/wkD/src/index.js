import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './index.css';

injectTapEventPlugin();

firebase.initializeApp({
    apiKey: "AIzaSyD9BH_xJ9XbxNN7LM4_UEZ_s5k5P7IM-Fc",
    authDomain: "ntutchatlab.firebaseapp.com",
    databaseURL: "https://ntutchatlab.firebaseio.com",
    projectId: "ntutchatlab",
    storageBucket: "ntutchatlab.appspot.com",
    messagingSenderId: "217828621301"
  });

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
