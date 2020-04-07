import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import * as WebBrowser from 'expo-web-browser';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';

import DrawerButton from 'app/src/common/DrawerButton';
import MainStackNavigator from 'app/src/screens/MainStackNavigator';
import AboutStackNavigator from 'app/src/screens/SideDrawerNavigator/AboutStackNavigator';

import styles from './styles';

const SideDrawer = createDrawerNavigator();
const SideDrawerNavigator = () => {
  const context = StateContainer.useContainer();
  return (
    <SideDrawer.Navigator
      drawerType="front"
      drawerPosition="left"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} context={context} />
      )}
    >
      <SideDrawer.Screen
        name="Main"
        component={MainStackNavigator}
        options={{
          drawerLabel: 'Main',
          drawerIcon: (props) => <Ionicons name="md-home" {...props} />,
        }}
      />
      <SideDrawer.Screen
        name="About"
        component={AboutStackNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons name="md-information-circle-outline" {...props} />
          ),
        }}
      />
      <SideDrawer.Screen
        name="Help"
        component={HelpStackNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons name="md-help-circle-outline" {...props} />
          ),
        }}
      />
      <SideDrawer.Screen
        name="Setting"
        component={SettingStackNavigator}
        options={{
          drawerIcon: (props) => <Ionicons name="md-settings" {...props} />,
        }}
      />
    </SideDrawer.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Docs"
        icon={(props) => <Ionicons name="md-paper" {...props} />}
        onPress={
          () =>
            WebBrowser.openBrowserAsync(
              'https://reactnavigation.org/docs/drawer-navigator'
            )
          // Linking.openUrl('https://reactnavigation.org/docs/drawer-navigator')
        }
      />
      <DrawerItem
        label="Logout"
        icon={(props) => <Ionicons name="md-log-out" {...props} />}
        onPress={() => props.context.setLogin(false)}
      />
    </DrawerContentScrollView>
  );
};

const HelpStack = createStackNavigator();
const HelpStackNavigator = () => {
  return (
    <HelpStack.Navigator>
      <HelpStack.Screen
        name="Help"
        component={HelpScreen}
        options={({ navigation }) => ({
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </HelpStack.Navigator>
  );
};

const HelpScreen = () => {
  return (
    <View style={styles.container}>
      <Text>HelpScreen</Text>
    </View>
  );
};

const SettingStack = createStackNavigator();
const SettingStackNavigator = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="Setting"
        component={SettingScreen}
        options={({ navigation }) => ({
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </SettingStack.Navigator>
  );
};

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SettingScreen</Text>
    </View>
  );
};

export default SideDrawerNavigator;
