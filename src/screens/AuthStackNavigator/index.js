import React from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';
import { Button, Icon, Input, CheckBox } from 'react-native-elements';
// import { FontAwesome5 } from '@expo/vector-icons';

import styles from './styles';

const AuthStack = createStackNavigator();
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

const LoginScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();
  let [email, setEmail] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [rememberLogin, setRememberLogin] = React.useState(false);

  return (
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon type="FontAwesome5" name="store" size={64} color={'white'} />
        <Text style={styles.heading}>KAUKAU</Text>
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
          onPress={() => context.setLogin(true)}
          buttonStyle={{
            backgroundColor: '#FF9800',
            borderRadius: 10,
          }}
          containerStyle={{ marginHorizontal: 30, marginTop: 16 }}
        ></Button>
        <Button
          title="SIGN UP"
          onPress={() => navigation.navigate('Signup')}
          type="outline"
          buttonStyle={{
            borderRadius: 30,
          }}
          containerStyle={{ marginHorizontal: 30, marginTop: 10 }}
        ></Button>
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
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={[styles.headerContainer, { padding: 10 }]}>
        <Text style={styles.heading}>USER REGISTRATION</Text>
      </View>
      <View style={{ padding: 10 }}>
        <InputBaseSign placeholder="Username" />
        <InputBaseSign placeholder="Email" />
        <InputBaseSign placeholder="Address" />
        <InputBaseSign placeholder="Phone" />
        <Button
          title="SIGN UP"
          buttonStyle={{
            borderRadius: 10,
          }}
          containerStyle={{ marginHorizontal: 30, marginTop: 10 }}
        />
      </View>
    </ScrollView>
  );
};

export default AuthStackNavigator;
