import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerButton from 'app/src/common/DrawerButton';
import MainTabNavigator from 'app/src/screens/MainStackNavigator/MainTabNavigator';

import styles from './styles';

const MainStack = createStackNavigator();
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator headerMode="none">
      <MainStack.Screen name="Main" component={MainTabNavigator} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
