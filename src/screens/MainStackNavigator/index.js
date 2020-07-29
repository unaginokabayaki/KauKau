import React from 'react';
import { View, Text } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import DrawerButton from 'app/src/common/DrawerButton';
import MainTabNavigator from 'app/src/screens/MainStackNavigator/MainTabNavigator';
import PhotoStackNavigator from 'app/src/screens/MainStackNavigator/PhotoStackNavigator';

import styles from './styles';

const MainStack = createStackNavigator();
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <MainStack.Screen name="Main" component={MainTabNavigator} />
      <MainStack.Screen
        name="Photo"
        component={PhotoStackNavigator}
        // options={{
        //   gestureEnabled: true,
        //   cardOverlayEnabled: true,
        //   ...TransitionPresets.ModalPresentationIOS,
        // }}
      />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
