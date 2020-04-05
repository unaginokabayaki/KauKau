import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as WebBrowser from 'expo-web-browser';
import { StateContainer, useStore } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';

function LoginScreen({ navigation }) {
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
}

function CreateAccountScreen() {
  let context = StateContainer.useContainer();
  return (
    <View style={styles.container}>
      <Text>CreateAccountScreen</Text>
    </View>
  );
}

const RootStack = createStackNavigator();
const SideDrawer = createDrawerNavigator();
const MainTab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

function MainTabNavigator({ navigation }) {
  return (
    <MainTab.Navigator tabBarOptions={{ showLabel: true }}>
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
        component={RegisterScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-camera" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-person" size={size} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Item" component={ItemScreen} />
    </HomeStack.Navigator>
  );
}

function HomeScreen({ navigation }) {
  let context = StateContainer.useContainer();

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Button title="Item" onPress={() => navigation.navigate('Item')}></Button>
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      ></Button>
      <Button title="Help" onPress={() => navigation.navigate('Help')}></Button>
    </View>
  );
}

function ItemScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>ItemScreen</Text>
    </View>
  );
}

function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text>RegisterScreen</Text>
    </View>
  );
}

function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Text>NotificationScreen</Text>
    </View>
  );
}

function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>AccountScreen</Text>
    </View>
  );
}

function SideDrawerNavigator() {
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
        component={MainTabNavigator}
        options={{ drawerLabel: 'Main' }}
      />
      <SideDrawer.Screen name="About" component={AboutScreen} />
      <SideDrawer.Screen name="Help" component={HelpScreen} />
      <SideDrawer.Screen name="Setting" component={SettingScreen} />
    </SideDrawer.Navigator>
  );
}

function CustomDrawerContent(props) {
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
}

function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>AboutScreen</Text>
    </View>
  );
}

function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text>HelpScreen</Text>
    </View>
  );
}

function SettingScreen() {
  return (
    <View style={styles.container}>
      <Text>SettingScreen</Text>
    </View>
  );
}

function RootkNavigator(props) {
  const context = StateContainer.useContainer();
  const ref = React.useRef();

  toggleDrawer = () => {
    ref.current?.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <NavigationContainer ref={ref}>
      {context.isLogin ? (
        <RootStack.Navigator option={{ headerShown: false }} screenOptions={{}}>
          <RootStack.Screen
            name="Drawer"
            component={SideDrawerNavigator}
            options={{
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    toggleDrawer();
                  }}
                >
                  <Ionicons
                    name="md-menu"
                    size={36}
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>
              ),
              animationEnabled: false,
            }}
          />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator>
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animationEnabled: false }}
          />
          <RootStack.Screen
            name="CreateAccount"
            component={CreateAccountScreen}
          />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <StateContainer.Provider>
      <RootkNavigator />
    </StateContainer.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
