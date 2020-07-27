import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { Button, Overlay, Input, CheckBox, Icon } from 'react-native-elements';

import DrawerButton from 'app/src/common/DrawerButton';
import LoginOverlay from 'app/src/common/LoginOverlay';
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
      <LoginOverlay showLogin={showLogin} setShowLogin={setShowLogin} />
      <Text>AccountScreen</Text>
      {context.user.isAnonymous && (
        <Button title="Login to continue" onPress={() => setShowLogin(true)} />
      )}
    </View>
  );
};

export default MainTabNavigator;
