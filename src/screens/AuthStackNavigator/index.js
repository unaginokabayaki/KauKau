import React from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';
import { Button, Icon, Input, CheckBox } from 'react-native-elements';

import firebase from 'app/src/firebase';
import styles from './styles';

const AuthStack = createStackNavigator();
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Start" component={StartScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </AuthStack.Navigator>
  );
};

const StartScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();
  React.useEffect(() => {
    console.log('StartScreen');

    (async () => {
      // 画面起動時、ログイン済みだったらメイン画面に遷移します
      let { authInfo } = await firebase.checkLoginUser();
      console.log(authInfo);
      if (authInfo) {
        console.log('SkipAuth:' + authInfo.uid);
        let { user } = await firebase.getUser(authInfo.uid);
        context.login(authInfo, user);
      }
    })();
  }, []);

  useGoogleAccount = async () => {
    await firebase.signInWithGoogle();
  };

  useGithubAccount = async () => {
    await firebase.signInWithGithub();
  };

  useSlackAccount = async () => {
    await firebase.signInWithSlack();
  };

  useYahooAccount = async () => {
    await firebase.signInWithYahoo();
  };

  loginAsGuest = async () => {
    const { authInfo } = await firebase.loginAsGuest();
    if (!authInfo.error) {
      let { user } = await firebase.getUser(authInfo.uid);
      context.login(authInfo, user);
    } else {
      console.log(authInfo);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon type="FontAwesome5" name="store" size={64} color={'white'} />
        <Text style={styles.heading}>KAUKAU</Text>
      </View>
      <View style={styles.formContainer}>
        <Button
          title="CREATE ACCOUNT"
          icon={{
            name: 'md-arrow-forward',
            type: 'ionicon',
            color: '#007aff',
          }}
          iconRight
          onPress={() => navigation.navigate('Signup')}
          type="outline"
          buttonStyle={styles.roundButtonStyle}
          containerStyle={styles.roundButtonContainer}
        />
        <Button
          title="Login with email"
          icon={{ name: 'md-mail', type: 'ionicon', color: 'white' }}
          onPress={() => navigation.navigate('Login')}
          buttonStyle={styles.roundButtonStyle}
          containerStyle={styles.roundButtonContainer}
        />
        <Button
          title="Login with Google"
          icon={{ name: 'google', type: 'font-awesome', color: 'white' }}
          onPress={useGoogleAccount}
          buttonStyle={{ ...styles.roundButtonStyle, backgroundColor: 'green' }}
          containerStyle={styles.roundButtonContainer}
        />
        <Button
          title="Login with Github"
          icon={{ name: 'github', type: 'font-awesome', color: 'white' }}
          onPress={useGithubAccount}
          buttonStyle={{ ...styles.roundButtonStyle, backgroundColor: 'black' }}
          containerStyle={styles.roundButtonContainer}
        />
        <Button
          title="Login with Slack"
          icon={{ name: 'slack', type: 'font-awesome', color: 'white' }}
          onPress={useSlackAccount}
          buttonStyle={{
            ...styles.roundButtonStyle,
            backgroundColor: 'orange',
          }}
          containerStyle={styles.roundButtonContainer}
        />
        <Button
          title="Login with Yahoo"
          icon={{ name: 'yahoo', type: 'font-awesome', color: 'white' }}
          onPress={useYahooAccount}
          buttonStyle={{
            ...styles.roundButtonStyle,
            backgroundColor: 'purple',
          }}
          containerStyle={styles.roundButtonContainer}
        />
        <Button
          title="Try now"
          type="clear"
          onPress={loginAsGuest}
          buttonStyle={styles.roundButtonStyle}
          containerStyle={styles.roundButtonContainer}
        />
      </View>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [rememberLogin, setRememberLogin] = React.useState(false);

  React.useEffect(() => {
    console.log('LoginScreen');
  }, []);

  login = async () => {
    let { authInfo, error } = await firebase.basicLogin(email, password);

    if (error) {
      Alert.alert('Error', error);
    } else {
      // メール承認済みでない場合ログインさせない
      if (!user.emailVerified) {
        // メール承認済みでない場合、承認リンクを再度送るか確認
        Alert.alert(
          'Verify Email',
          'You need to verify email before login. Would you like us to resend link again?',
          [
            { text: 'No' },
            { text: 'Yes', onPress: firebase.resendEmailVerifyLink() },
          ]
        );
        return;
      }

      Alert.alert('Successfully logged in!');

      let { user } = await firebase.getUser(authInfo.uid);
      context.login(authInfo, user);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={[styles.headerContainer, { padding: 10 }]}>
        <Text style={styles.heading}>LOGIN WITH EMAIL</Text>
      </View>
      <View style={styles.formContainer}>
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
          <CheckBox
            title="Remember Login"
            containerStyle={{
              marginTop: 16,
              backgroundColor: 'transparent',
              borderWidth: 0,
            }}
            checked={rememberLogin}
            onPress={() => setRememberLogin(!rememberLogin)}
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
        <Button
          title="Forgot Password?"
          onPress={() => navigation.navigate('ForgotPassword')}
          type="clear"
          containerStyle={{ marginHorizontal: 30, marginTop: 10 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const ForgotPasswordScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();
  let [email, setEmail] = React.useState('');

  sendPasswordRestLink = async () => {
    let { error } = await firebase.sendPasswordResetEail(email);
    if (!error) {
      Alert.alert(
        'We sent password reset link to your email address. Please check.'
      );
    } else {
      Alert.alert('Error', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={[styles.headerContainer, { padding: 10 }]}>
        <Text style={styles.heading}>RESET PASSWORD</Text>
      </View>
      <View style={styles.formContainer}>
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
        </View>
        <Button
          title="RESET PASSWORD"
          onPress={sendPasswordRestLink}
          buttonStyle={{
            backgroundColor: '#FF9800',
            borderRadius: 10,
          }}
          containerStyle={{ marginHorizontal: 30, marginTop: 16 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const InputBaseSign = (props) => {
  return (
    <Input
      {...props}
      inputStyle={{ color: '#7384B4' }}
      inputContainerStyle={{
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 10,
        marginVertical: 10,
        height: 45,
      }}
    />
  );
};

const SignupScreen = () => {
  let context = StateContainer.useContainer();
  let [username, setUsername] = React.useState('');
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [confPassword, setConfPassword] = React.useState('');

  signup = async () => {
    let { authInfo, error } = await firebase.basicSignup(
      email,
      password,
      username
    );

    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Account has been created!');

      let { user } = await firebase.getUser(authInfo.uid);
      context.login(authInfo, user);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={[styles.headerContainer, { padding: 10 }]}>
        <Text style={styles.heading}>USER REGISTRATION</Text>
      </View>
      <View style={{ padding: 10 }}>
        <InputBaseSign
          placeholder="Username"
          value={username}
          onChangeText={(value) => setUsername(value)}
          keyboardType="ascii-capable"
        />
        <InputBaseSign
          placeholder="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
          }}
          keyboardType="email-address"
        />
        <InputBaseSign
          placeholder="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
          }}
          secureTextEntry
        />
        <InputBaseSign
          placeholder="Confirm Password"
          value={confPassword}
          onChangeText={(value) => {
            setConfPassword(value);
          }}
          secureTextEntry
        />
        <Button
          title="SIGN UP"
          buttonStyle={{
            borderRadius: 10,
          }}
          containerStyle={{ marginHorizontal: 30, marginTop: 10 }}
          onPress={signup}
        />
      </View>
    </ScrollView>
  );
};

export default AuthStackNavigator;
