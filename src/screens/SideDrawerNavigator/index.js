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
        options={{ drawerLabel: 'Main' }}
      />
      <SideDrawer.Screen name="About" component={AboutStackNavigator} />
      <SideDrawer.Screen name="Help" component={HelpStackNavigator} />
      <SideDrawer.Screen name="Setting" component={SettingStackNavigator} />
    </SideDrawer.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Docs"
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
        onPress={() => props.context.setLogin(false)}
      />
    </DrawerContentScrollView>
  );
};

const AboutStack = createStackNavigator();
const AboutStackNavigator = () => {
  return (
    <AboutStack.Navigator>
      <AboutStack.Screen
        name="About"
        component={AboutScreen}
        options={({ navigation }) => ({
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </AboutStack.Navigator>
  );
};

const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>AboutScreen</Text>
    </View>
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
