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
  googleAuthiosClientId,
  githubAuthClientId,
  githubAuthClientSecret,
  githubAuthRevocationEndPoint,
  slackAuthClientId,
  slackAuthClientSecret,
  yahooAuthClientId,
  yahooAuthClientSecret,
} from 'react-native-dotenv';
import * as Google from 'expo-google-app-auth';
import * as AppAuth from 'expo-app-auth';
import * as AuthSession from 'expo-auth-session';

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

const googleAuthConfig = {
  iosClientId: googleAuthiosClientId,
};
// const googleAuthConfig = {
//   expoClientId: `<YOUR_WEB_CLIENT_ID>`,
//   iosClientId: ``<YOUR_IOS_CLIENT_ID>``,
//   androidClientId: `<YOUR_ANDROID_CLIENT_ID>`,
//   iosStandaloneAppClientId: `<YOUR_IOS_CLIENT_ID>`,
//   androidStandaloneAppClientId: `<YOUR_ANDROID_CLIENT_ID>`
// };

const githubAuthConfig = {
  scopes: ['read:user'],
  clientId: githubAuthClientId,
  clientSecret: githubAuthClientSecret,
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: githubAuthRevocationEndPoint,
  },
  redirectUrl: 'host.exp.exponent://oauthredirect',
};

const slackAuthConfig = {
  scopes: ['identify'],
  clientId: slackAuthClientId,
  clientSecret: slackAuthClientSecret,
  serviceConfiguration: {
    authorizationEndpoint: 'https://slack.com/oauth/authorize',
    tokenEndpoint: 'https://slack.com/api/oauth.access',
  },
  redirectUrl: 'host.exp.exponent://oauthredirect',
};

const yahooAuthConfig = {
  scopes: ['profile', 'email'],
  clientId: yahooAuthClientId,
  clientSecret: yahooAuthClientSecret,
  serviceConfiguration: {
    authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
    tokenEndpoint: 'https://api.login.yahoo.com/oauth2/get_token',
  },
  redirectUrl: 'host.exp.exponent://oauthredirect',
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
    this.item = db.collection('item');
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
        } else {
          // No user is signed in.
          console.log('user not logged in.');

          this.fbUid = null;
        }

        resolve(this.fbUid);
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
      return { uid: user.uid };
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
      // if (!user.emailVerified) {
      //   return { emailVerified: false };
      // }

      console.log(user);
      return { user: user };
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

  signInWithGoogle = async () => {
    try {
      let { type, idToken, accessToken } = await Google.logInAsync(
        googleAuthConfig
      );

      if (type !== 'success') {
        return 'cancelled';
      }
      console.log(type);

      let credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );
      console.log(credential);

      let result = await firebase.auth().signInWithCredential(credential);
      console.log(result);
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  signInWithGithub = async () => {
    try {
      // await this.oAuthGithub();
      // return;
      let res = await AppAuth.authAsync(githubAuthConfig);
      console.log(res);
      let { token } = res;

      let credential = firebase.auth.GithubAuthProvider.credential(token);

      let result = await firebase.auth().signInWithCredential(credential);
      console.log(result);
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  signInWithSlack = async () => {
    try {
      let res = await AppAuth.authAsync(slackAuthConfig);
      console.log(res);
      let { idToken, accessToken } = res;

      let credential = new firebase.auth.OAuthProvider('slack.com').credential(
        idToken,
        accessToken
      );
      console.log(credential);
      // let result = await firebase.auth().signInWithCustomToken(accessToken);
      let result = await firebase.auth().signInWithCredential(credential);
      console.log(result);
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  signInWithYahoo = async () => {
    try {
      let res = await AppAuth.authAsync(yahooAuthConfig);
      console.log(res);
      let { idToken, accessToken } = res;

      let credential = new firebase.auth.OAuthProvider('yahoo.com').credential(
        idToken,
        accessToken
      );
      console.log(credential);
      // let result = await firebase.auth().signInWithCustomToken(accessToken);
      let result = await firebase.auth().signInWithCredential(credential);
      console.log(result);
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  // アイテム登録
  registerItem = async (item) => {
    try {
      const docRef = await this.item.add({
        image_uri: [],
        title: item.title,
        description: item.description,
        category: item.category,
        condition: item.condition,
        item_price: item.price,
        // dealing_fee: 0,
        release_date: null,
        status: 0,
        seller: this.fbUid,
        buyer: '',
      });
      console.log('Document written with ID: ', docRef.id);

      // this.item.add({ ...item, seller: this.fbUid });

      return { id: docRef.id };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };
}

export default new Firebase(firebaseConfig);
