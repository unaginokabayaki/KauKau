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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';

import HomeStackNavigator from 'app/src/screens/MainStackNavigator/MainTabNavigator/HomeStackNavigator';
import RegisterStackNavigator from 'app/src/screens/MainStackNavigator/MainTabNavigator/RegisterStackNavigator';
import AccountStackNavigator from 'app/src/screens/MainStackNavigator/MainTabNavigator/AccountStackNavigator';

import firebase from 'app/src/firebase';
import styles from './styles';

const MainTab = createBottomTabNavigator();
const MainTabNavigator = ({ navigation }) => {
  return (
    <MainTab.Navigator
      tabBarOptions={{ showLabel: true, activeTintColor: '#e91e63' }}
    >
      <MainTab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="RegisterStack"
        component={RegisterStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-camera" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="AccountStack"
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

export default MainTabNavigator;
