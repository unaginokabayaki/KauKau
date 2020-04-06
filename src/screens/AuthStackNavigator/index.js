import React from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';

import styles from './styles';

const AuthStack = createStackNavigator();
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
    </AuthStack.Navigator>
  );
};

const LoginScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();
  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
      <Button title="Login" onPress={() => context.setLogin(true)}></Button>
      <Button
        title="CreateAccount"
        onPress={() => navigation.navigate('CreateAccount')}
      ></Button>
    </View>
  );
};

const CreateAccountScreen = () => {
  let context = StateContainer.useContainer();
  return (
    <View style={styles.container}>
      <Text>CreateAccountScreen</Text>
    </View>
  );
};

export default AuthStackNavigator;
