import React from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { StateContainer } from 'app/src/AppContext';
import { Button, Overlay, Input, CheckBox, Icon } from 'react-native-elements';

import firebase from 'app/src/firebase';

const LoginOverlay = (props) => {
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

export default LoginOverlay;
