import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { Button, Overlay, Input, CheckBox, Icon } from 'react-native-elements';

import DrawerButton from 'app/src/common/DrawerButton';
import HomeStackNavigator from 'app/src/screens/MainStackNavigator/MainTabNavigator/HomeStackNavigator';
import RegisterStackNavigator from 'app/src/screens/MainStackNavigator/MainTabNavigator/RegisterStackNavigator';

import firebase from 'app/src/firebase';
import styles from './styles';

const MainTab = createBottomTabNavigator();
const MainTabNavigator = ({ navigation }) => {
  return (
    <MainTab.Navigator
      tabBarOptions={{ showLabel: true, activeTintColor: '#e91e63' }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Register"
        component={RegisterStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-camera" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Account"
        component={AccountStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-person" size={size} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

const NotificationStack = createStackNavigator();
const NotificationStackNavigator = () => {
  return (
    <NotificationStack.Navigator>
      <NotificationStack.Screen
        name="Notification"
        component={NotificationScreen}
      />
    </NotificationStack.Navigator>
  );
};

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text>NotificationScreen</Text>
    </View>
  );
};

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
    </AccountStack.Navigator>
  );
};

const AccountScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();
  // let overlayRef = React.useRef(null);

  let [showLogin, setShowLogin] = React.useState(false);

  return (
    <View style={styles.container}>
      <LoginOverly showLogin={showLogin} setShowLogin={setShowLogin} />
      <Text>AccountScreen</Text>
      {context.user.isAnonymous && (
        <Button title="Login to continue" onPress={() => setShowLogin(true)} />
      )}
    </View>
  );
};

const LoginOverly = (props) => {
  let context = StateContainer.useContainer();

  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');

  login = async () => {
    let { user, error } = await firebase.basicLogin(email, password);

    if (error) {
      Alert.alert('Error', error);
    } else {
      // メール承認済みでない場合ログインさせない
      // if (!user.emailVerified) {
      //   // メール承認済みでない場合、承認リンクを再度送るか確認
      //   Alert.alert(
      //     'Verify Email',
      //     'You need to verify email before login. Would you like us to resend link again?',
      //     [
      //       { text: 'No' },
      //       { text: 'Yes', onPress: firebase.resendEmailVerifyLink() },
      //     ]
      //   );
      //   return;
      // }

      Alert.alert('Successfully logged in!');

      // ログイン情報を記録
      context.login(user);
      // 自分を閉じる
      props.setShowLogin(false);
    }
  };

  return (
    <Overlay
      isVisible={props.showLogin}
      onBackdropPress={() => props.setShowLogin(false)}
    >
      <View>
        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            marginTop: -15,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => props.setShowLogin(false)}
        >
          <Text style={{ fontSize: 32 }}>×</Text>
        </TouchableOpacity>
        <View
          style={{
            height: 100,
            backgroundColor: 'seagreen',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 32 }}>LOG IN</Text>
        </View>
        <View>
          <Input
            placeholder="Email"
            leftIcon={
              <Icon
                type="simple-line-icon"
                name="envelope"
                size={24}
                color={'rgba(0,0,0,0.38)'}
                style={{ backgroundColor: 'transparent' }}
                containerStyle={{ paddingRight: 10 }}
              />
            }
            containerStyle={{ marginTop: 16 }}
            keyboardType="email-address"
            returnKeyType="next"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <Input
            placeholder="Password"
            leftIcon={
              <Icon
                type="simple-line-icon"
                name="lock"
                size={24}
                color={'rgba(0,0,0,0.38)'}
                style={{ backgroundColor: 'transparent' }}
                containerStyle={{ paddingRight: 10 }}
              />
            }
            containerStyle={{ marginTop: 16 }}
            secureTextEntry
            returnKeyType="done"
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
        </View>
        <Button
          title="LOG IN"
          onPress={login}
          buttonStyle={{
            backgroundColor: '#FF9800',
            borderRadius: 10,
          }}
          containerStyle={{ marginHorizontal: 30, marginTop: 16 }}
        />
      </View>
    </Overlay>
  );
};

export default MainTabNavigator;
