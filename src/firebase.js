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
import * as Random from 'expo-random';

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

    this.db = firebase.firestore();
    this.user = this.db.collection('user');
    this.item = this.db.collection('item');
  }

  wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  checkLoginUser = async () => {
    return new Promise((resolve, reject) => {
      // signin singoutで実行される、オブザーバ関数
      firebase.auth().onAuthStateChanged(async (user) => {
        // await this.wait(3000);
        // if (user && user.emailVerified) {
        if (user) {
          // User is signed in.
          console.log('User: ' + user.uid);

          this.fbUid = user.uid;
        } else {
          // No user is signed in.
          console.log('user not logged in.');

          this.fbUid = null;
        }

        resolve({ authInfo: user });
        // resolve(this.fbUid);
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
      return { authInfo: user };
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
      return { authInfo: user };
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

  loginAsGuest = async () => {
    try {
      let { user } = await firebase.auth().signInAnonymously();

      console.log(user);
      return { authInfo: user };
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

  saveImages = async (itemId, images) => {
    return new Promise(async (resolve, reject) => {
      try {
        let paths = [];
        for (let item of images) {
          const ext = item.uri.split('.').slice(-1)[0];
          const filename = await this.newFileName();
          const path = `item/${itemId}/${filename}.${ext}`;
          let uploadedPath = await this.uploadFile(path, item.uri);
          console.log('new file is uploaded');
          paths.push(uploadedPath);
        }
        resolve(paths);
      } catch (e) {
        reject(e);
      }
    });
  };

  // アイテム登録
  registerItem = async (item, images, status) => {
    try {
      let batch = this.db.batch();
      // id発行
      const docRef = this.item.doc();

      const addRef = batch.set(docRef, {
        created_time: firebase.firestore.FieldValue.serverTimestamp(),
        title: item.title,
        description: item.description,
        category: item.category,
        condition: item.condition,
        item_price: item.price,
        // dealing_fee: 0,
        release_date: null,
        status: status,
        seller: this.fbUid,
        buyer: '',
      });
      console.log(`new item is created: ${addRef.id}`);

      // 画像アップロード
      const imageUploadedPath = await this.saveImages(addRef.id, images);
      // console.log(imageUploadedPath);

      let data = {
        image_uri: imageUploadedPath,
        updated_time: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // 画像パス更新
      const docUplRef = batch.update(this.item.doc(`${docRef.id}`), data);
      console.log('file path is saved');

      batch.commit();

      return { id: docRef.id };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  newFileName = async () => {
    let randomBytes = await Random.getRandomBytesAsync(32);
    return randomBytes.reduce((a, c) => a + (c % 32).toString(32));
  };

  uploadFile = async (path, uri) => {
    try {
      console.log(`Upload from: ${uri}`);
      console.log(`Upload to: ${path}`);

      let storageRef = firebase.storage().ref().child(path);
      const blob = await fetch(uri).then((response) => response.blob());
      // const metadata = { contentType: 'image/jpeg' };

      return new Promise(async (resolve, reject) => {
        let uploadTask = storageRef.put(blob);
        const unsbscribe = uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          // next
          (snapshot) => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress = Math.floor(progress);
            console.log(`Upload is ${progress}% done`);
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          // error
          (err) => {
            console.log(err);
            unsbscribe();
            reject(err);
          },
          // complete
          async () => {
            unsbscribe();
            const url = await uploadTask.snapshot.ref.getDownloadURL();
            console.log('download:' + url);
            // return url;
            resolve(url);
          }
        );
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  getItems = async (cursor = null, keyword = '', num = 6) => {
    try {
      let ref = this.item;
      if (keyword) {
        ref = ref.where('title', '==', keyword);
      }
      ref = ref.orderBy('created_time', 'desc').limit(num);

      // 最後尾の次のデータから始める
      if (cursor) {
        ref = ref.startAfter(cursor);
      }

      const snapshot = await ref.get();

      // map中でPromiseを使う場合はPromise.allで囲ってawaitする
      const data = snapshot.docs.map((doc) => {
        const data = { id: doc.id, ...doc.data() };
        return data;
      });

      // 最後尾のデータを返す(全部出した場合はnull)
      const datalen = snapshot.docs.length;
      const currentCursor = datalen > 0 ? snapshot.docs[datalen - 1] : null;

      return { data, cursor: currentCursor };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  getItem = async (id) => {
    try {
      let doc = await this.item.doc(id).get();
      if (!doc.exists) {
        throw Error('No such document');
      }

      let data = { id, ...doc.data() };

      return { data };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  isLikedItem = async (itemId) => {
    try {
      let likedRef = await this.user
        .doc(`${this.fbUid}`)
        .collection('liked_item')
        .doc(`${itemId}`)
        .get();

      return { exists: likedRef.exists };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  getUser = async (id) => {
    try {
      let doc = await this.user.doc(`${id}`).get();
      if (!doc.exists) {
        throw Error('No such document');
      }

      let data = { id, name: '', profile: '', deposit: 0, ...doc.data() };

      return { user: data };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  updateUser = async (user) => {
    try {
      let data = {
        name: user.name,
        profile: user.profile,
        updated_time: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // 参照先がローカルの場合のみ更新
      if (user.image_uri.startsWith('file://')) {
        const ext = user.image_uri.split('.').slice(-1)[0];
        const filename = 'profile_icon';
        const path = `user/${user.id}/${filename}.${ext}`;

        let uploadedPath = await this.uploadFile(path, user.image_uri);
        console.log('new file is uploaded');

        data = { ...data, image_uri: uploadedPath };
      }

      const docUplRef = await this.user.doc(`${user.id}`).update(data);

      return { data };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  updateDeposit = async (amount) => {
    try {
      let data = {
        deposit: firebase.firestore.FieldValue.increment(amount),
        updated_time: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const updateRef = await this.user.doc(`${this.fbUid}`);
      await updateRef.update(data);

      const snap = await updateRef.get();

      return { id: snap.id, ...snap.data() };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  updateDeviceToken = async (deviceToken) => {
    try {
      let data = {
        deviceToken,
      };

      const updateRef = await this.user.doc(`${this.fbUid}`);
      await updateRef.update(data);

      const snap = await updateRef.get();

      return { id: snap.id, ...snap.data() };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  buyItem = async (itemId) => {
    try {
      let userRef = await this.user.doc(`${this.fbUid}`);
      let itemRef = await this.item.doc(`${itemId}`);

      let tran = await this.db.runTransaction(async (t) => {
        // 残高の取得
        let user = await t.get(userRef);
        // console.log(user.data());
        let item = await t.get(itemRef);
        // console.log(item.data());

        if (item.data().status !== 'onsale') {
          return Promise.reject(new Error('このアイテムは購入できません'));
        }
        // 決済処理
        let newDeposit = user.data().deposit - item.data().item_price;
        if (newDeposit < 0) {
          return Promise.reject(new Error('残高が不足しています'));
        }
        await t.update(userRef, { deposit: newDeposit });

        // ステータス変更
        await t.update(itemRef, { status: 'sold' });

        return Promise.resolve({ deposit: newDeposit });
      });

      console.log(tran);

      return tran;
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  toggleLike = async (itemId, toggle) => {
    try {
      const likeRef = this.user
        .doc(`${this.fbUid}`)
        .collection('liked_item')
        .doc(`${itemId}`);

      let res = null;
      if (toggle) {
        res = await likeRef.set({
          id: itemId,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        res = await likeRef.delete();
      }

      // console.log(res);

      return true;
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  addComment = async (itemId, comment) => {
    try {
      const addRef = await this.item
        .doc(`${itemId}`)
        .collection('comment')
        .add({
          text: comment.text,
          userId: comment.user._id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      console.log(`new comment is created: ${addRef.id}`);

      const docRef = await this.item
        .doc(`${itemId}`)
        .collection('comment')
        .doc(`${addRef.id}`)
        .get();
      // console.log(docRef);

      return { id: docRef.id, ...docRef.data() };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };

  getComments = async (itemId) => {
    try {
      const collection = await this.item
        .doc(`${itemId}`)
        .collection('comment')
        .orderBy('createdAt')
        .get();

      const data = await Promise.all(
        collection.docs.map(async (doc) => {
          const { user } = await this.getUser(doc.data().userId);
          // const user = await this.user.doc(`${doc.data().userId}`).get();
          // console.log(user);
          return {
            id: doc.id,
            ...doc.data(),
            user: user,
            // user: { id: user.id, ...user.data() },
          };
        })
      );

      return { data };
    } catch (e) {
      console.log(e.message);
      return { error: e.message };
    }
  };
}

export default new Firebase(firebaseConfig);
