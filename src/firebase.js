import * as firebase from 'firebase';

import {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} from 'react-native-dotenv';

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

class Firebase {
  constructor(config = {}) {
    console.log('Initialize firebase');
    try {
      let project = firebase.initializeApp(config);
      console.log(project.name);
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }
  }

  basicSignin = async (email, password) => {
    try {
      let user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      console.log(user.uid);
      return user.uid;
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }
  };

  basicLogin = async (email, password) => {
    try {
      let { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      console.log(user.uid);
      return user.uid;
    } catch (e) {
      console.warn(e.message);
      return { error: e.message };
    }
  };
}

export default new Firebase(firebaseConfig);
