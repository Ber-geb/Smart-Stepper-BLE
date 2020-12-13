import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
// import {Platform} from 'react-native';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyAYAny1uIezQYftC_CZaslhOSVbnkk4vbI',
  authDomain: 'smart-stepper-26f5d.firebaseapp.com',
  databaseURL: 'https://smart-stepper-26f5d.firebaseio.com',
  projectId: 'smart-stepper-26f5d',
  storageBucket: 'smart-stepper-26f5d.appspot.com',
  messagingSenderId: '282615024353',
  appId: '1:282615024353:web:9d7a2d4b17d044552245a0',
  measurementId: 'G-7Q0TQ2128X',
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyAYAny1uIezQYftC_CZaslhOSVbnkk4vbI',
//   authDomain: 'smart-stepper-26f5d.firebaseapp.com',
//   databaseURL: 'https://smart-stepper-26f5d.firebaseio.com',
//   projectId: 'smart-stepper-26f5d',
//   storageBucket: 'smart-stepper-26f5d.appspot.com',
//   messagingSenderId: '282615024353',
//   appId: '1:282615024353:web:20c0dfb549eaadd52245a0',
//   measurementId: 'G-ZWK4E44NML',
// };

// // Your secondary Firebase project credentials for Android...
// const androidCredentials = {
//   clientId:
//     '282615024353-l4vc9jqua510au4n6970134jsh83rusf.apps.googleusercontent.com',
//   appId: '1:282615024353:android:c547b0af457ad1352245a0',
//   apiKey: 'AIzaSyAOuAJpT3gH_2EstTclCqSTj1loPss4fKc',
//   databaseURL: 'https://smart-stepper-26f5d.firebaseio.com',
//   storageBucket: 'smart-stepper-26f5d.appspot.com',
//   messagingSenderId: '282615024353',
//   projectId: 'smart-stepper-26f5d',
// };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({experimentalForceLongPolling: true});
}

export {firebase};
