import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import Constants from 'expo-constants';
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

      // 言語設定
      firebase.auth().languageCode = 'ja';
      // firebase.auth().useDeviceLanguage();
      // ログイン状態の設定
      // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }

    // ログインユーザのuid。コレクションのキーとして使う。
    this.fbUid = null;

    const db = firebase.firestore();
    this.user = db.collection('user');
  }

  wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  checkLoginUser = async () => {
    return new Promise((resolve, reject) => {
      // signin singoutで実行される、オブザーバ関数
      firebase.auth().onAuthStateChanged(async (user) => {
        // await this.wait(3000);
        if (user && user.emailVerified) {
          // if (user) {
          // User is signed in.
          console.log('User: ' + user.uid);

          this.fbUid = user.uid;
          resolve(user.uid);
        } else {
          // No user is signed in.
          console.log('user not logged in.');

          this.fbUid = null;
          resolve(null);
        }
      });
    });
  };

  // ユーザ登録
  basicSignup = async (email, password, username) => {
    try {
      let { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      this.fbUid = user.uid;
      // authのuserプロファイル
      await user.updateProfile({ displayName: username });
      // userデータ
      await this.user.doc(`${this.fbUid}`).set({ name: username });
      // 本人確認リンクの送信
      await user.sendEmailVerification();

      console.log(user);
      return user.uid;
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  // メールでログイン
  basicLogin = async (email, password) => {
    try {
      let { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      // メール承認済みかチェック
      if (!user.emailVerified) {
        return { emailVerified: false };
      }

      console.log(user);
      return user.uid;
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  // ログアウト
  logout = async () => {
    try {
      await firebase.auth().signOut();
      return true;
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  // ログイン中ユーザに対して本人確認リンクを送る
  resendEmailVerifyLink = async () => {
    try {
      let { user } = await firebase.auth().currentUser();
      //本人確認リンクを送る
      await user.sendEmailVerification();

      console.log(user);
      return user.uid;
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  // パスワードリセットリンクを送る
  sendPasswordResetEmail = async (email) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);

      return true;
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };
}

export default new Firebase(firebaseConfig);
