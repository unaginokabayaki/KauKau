import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Overlay,
  Input,
  CheckBox,
  Icon,
  ListItem,
  Image,
} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import DrawerButton from 'app/src/common/DrawerButton';
import LoginOverlay from 'app/src/common/LoginOverlay';

import firebase from 'app/src/firebase';

const AccountStack = createStackNavigator();
const AccountStackNavigator = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="Account"
        component={AccountScreen}
        options={({ navigation }) => ({
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
      <AccountStack.Screen name="User" component={UserScreen} />
      <AccountStack.Screen name="UserEdit" component={UserEditScreen} />
    </AccountStack.Navigator>
  );
};

const AccountScreen = ({ navigation, route }) => {
  let context = StateContainer.useContainer();
  let [showLogin, setShowLogin] = React.useState(false);
  let [user, setUser] = React.useState({});

  React.useEffect(() => {
    console.log(context.user);
    (async () => {
      let { user } = await firebase.getUser(context.user.uid);
      console.log(user);
      setUser(user);
    })();
  }, [showLogin]);

  return (
    <ScrollView>
      {context.user.isAnonymous && (
        <View style={styles.container}>
          <LoginOverlay showLogin={showLogin} setShowLogin={setShowLogin} />
          <Button
            title="Login to continue"
            onPress={() => setShowLogin(true)}
          />
        </View>
      )}
      <View>
        <Text>ユーザー</Text>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 10,
          }}
        >
          <Image
            source={{ uri: user.image_uri }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
            containerStyle={{ margin: 5 }}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ paddingVertical: 5, fontSize: 18 }}>
              {user.name}
            </Text>
            <Button
              title="プロフィール詳細"
              type="outline"
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 5,
              }}
              titleStyle={{ fontSize: 14, fontWeight: '600' }}
              onPress={() => navigation.navigate('User', { uid: user.id })}
            />
          </View>
        </View>
      </View>
      <View>
        <Text>アイテム</Text>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ListItem
            title="出品したアイテム"
            bottomDivider
            chevron
            onPress={() => null}
          />
          <ListItem
            title="購入したアイテム"
            bottomDivider
            chevron
            onPress={() => null}
          />
          <ListItem
            title="氏名・生年月日・現住所"
            bottomDivider
            chevron
            onPress={() => null}
          />
          <ListItem
            title="メール・パスワード"
            bottomDivider
            chevron
            onPress={() => null}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const UserScreen = ({ navigation, route }) => {
  let context = StateContainer.useContainer();
  let [user, setUser] = React.useState({});

  React.useEffect(() => {
    console.log(route.params.uid);
    (async () => {
      let { user } = await firebase.getUser(route.params.uid);
      console.log(user);
      setUser(user);
    })();
  }, [route.params]);

  return (
    <ScrollView>
      <View>
        <Text>ユーザー</Text>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 10,
          }}
        >
          <Image
            source={{ uri: user.image_uri }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
            containerStyle={{ margin: 5 }}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ paddingVertical: 5, fontSize: 18 }}>
              {user.name}
            </Text>
            <Button
              title="プロフィール編集"
              type="outline"
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 5,
              }}
              buttonStyle={{ borderColor: 'tomato' }}
              titleStyle={{ fontSize: 14, fontWeight: '600', color: 'tomato' }}
              onPress={() => navigation.navigate('UserEdit', { uid: user.id })}
            />
          </View>
        </View>
      </View>
      <View>
        <Text>プロフィール</Text>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'row',
            minHeight: 120,
            padding: 10,
          }}
        >
          <Text style={{ paddingVertical: 5 }}>{user.profile}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const UserEditScreen = ({ navigation, route }) => {
  let context = StateContainer.useContainer();
  const [form, setForm] = React.useState({
    image_uri: '',
    name: '',
    profile: '',
  });
  const [spinner, setSpinner] = React.useState(false);

  React.useEffect(() => {
    console.log(route.params.uid);
    (async () => {
      let { user } = await firebase.getUser(route.params.uid);
      console.log(user);
      setForm({
        id: user.id,
        image_uri: user.image_uri,
        name: user.name,
        profile: user.profile,
      });
    })();
  }, []);

  const updateUserProfile = async () => {
    setSpinner(true);
    let res = await firebase.updateUser(form);
    console.log(res);
    if (!res.error) {
      context.setUser({ ...context.user, ...res.data });
      navigation.navigate('User', { uid: route.params.uid });
    }
    setSpinner(false);
  };

  const updateImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setForm({ ...form, image_uri: uri });
    }
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      // const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('写真にアクセスする権限がありません。');
        throw 'permission denied';
      }
    }
  };

  pickImage = async () => {
    try {
      await getPermissionAsync();

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log(result);

      if (result.cancelled) {
        throw Error('cancelled');
      }

      return result.uri;
    } catch (e) {
      console.log(e.message);
      return '';
    }
  };

  return (
    <ScrollView>
      <Spinner
        visible={spinner}
        textContent={'登録中...'}
        textStyle={{ color: 'white' }}
      />
      <View>
        <Text>ユーザー</Text>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 10,
          }}
        >
          <TouchableOpacity onPress={updateImage}>
            <Image
              source={form.image_uri ? { uri: form.image_uri } : {}}
              style={{ width: 80, height: 80, borderRadius: 40 }}
              containerStyle={{ margin: 5 }}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <TextInput
              maxLength={24}
              value={form.name}
              onChangeText={(text) => {
                setForm({ ...form, name: text });
              }}
              style={{
                flex: 1,
                fontSize: 18,
                backgroundColor: 'lightgray',
                marginVertical: 30,
                paddingHorizontal: 5,
              }}
              placeholder={'ユーザー名'}
              returnKeyType={'done'}
            />
          </View>
        </View>
      </View>
      <View>
        <Text>プロフィール</Text>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'row',
            minHeight: 120,
            padding: 10,
          }}
        >
          <TextInput
            multiline
            maxLength={1000}
            value={form.profile}
            onChangeText={(text) => {
              setForm({ ...form, profile: text });
            }}
            placeholder={'自己紹介を記載してください'}
            style={{
              flex: 1,
              backgroundColor: 'lightgray',
              paddingHorizontal: 5,
            }}
            returnKeyType={'done'}
          />
        </View>
      </View>
      <Button
        title="保存"
        containerStyle={{
          margin: 5,
        }}
        buttonStyle={{ backgroundColor: 'tomato' }}
        titleStyle={{ fontSize: 14, fontWeight: '600' }}
        onPress={updateUserProfile}
      />
    </ScrollView>
  );
};

export default AccountStackNavigator;
