import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
        name="NotificationStack"
        component={NotificationStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="md-information-circle-outline"
              size={size}
              color={color}
            />
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
        name="NotificationTab"
        component={TopTabView}
        // component={NotificationTabNavigator}
      />
    </NotificationStack.Navigator>
  );
};

const NotificationTab = createMaterialTopTabNavigator();
const NotificationTabNavigator = () => {
  return (
    <NotificationTab.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        indicatorStyle: { backgroundColor: '#e91e63' },
        // tabStyle: { width: 'auto' },
      }}
    >
      <NotificationTab.Screen
        name="Notification"
        component={NotificationScreen}
      />
      <NotificationTab.Screen name="Infomation" component={InformationScreen} />
      <NotificationTab.Screen name="Todo" component={TodoScreen} />
    </NotificationTab.Navigator>
  );
};

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text>NotificationScreen</Text>
    </View>
  );
};

const InformationScreen = () => {
  return (
    <View style={styles.container}>
      <Text>InformationScreen</Text>
    </View>
  );
};

const TodoScreen = () => {
  return (
    <View style={styles.container}>
      <Text>TodoScreen</Text>
    </View>
  );
};

import { TabView, SceneMap, ScrollPager, TabBar } from 'react-native-tab-view';

const TopTabView = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Notification' },
    { key: 'second', title: 'Information' },
    { key: 'third', title: 'Todo' },
  ]);

  const initialLayout = { width: Dimensions.get('window').width };

  const renderScene = SceneMap({
    first: NotificationScreen,
    second: InformationScreen,
    third: TodoScreen,
  });

  // returnの省略形
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#e91e63' }}
      style={{ backgroundColor: 'white' }}
      labelStyle={{ color: 'black' }}
      scrollEnabled={true}
      // tabStyle={{ width: 140 }}
      // tabStyle={{ width: 'auto' }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderPager={(props) => <ScrollPager {...props} />}
      renderTabBar={renderTabBar}
    />
  );
};

export default MainTabNavigator;
