import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';

import DrawerButton from 'app/src/common/DrawerButton';
import SideDrawerNavigator from 'app/src/screens/SideDrawerNavigator';
import AuthStackNavigator from 'app/src/screens/AuthStackNavigator';

const RootStack = createStackNavigator();
const RootkNavigator = () => {
  const context = StateContainer.useContainer();

  return (
    <>
      {context.isLogin ? (
        <RootStack.Navigator option={{}} screenOptions={{ headerShown: false }}>
          <RootStack.Screen
            name="DrawerStack"
            component={SideDrawerNavigator}
            options={({ navigation }) => ({
              // headerLeft: () => <DrawerButton navigation={navigation} />,
              animationEnabled: false,
            })}
          />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen
            name="AuthStack"
            component={AuthStackNavigator}
            options={{ animationEnabled: false }}
          />
        </RootStack.Navigator>
      )}
    </>
  );
};

export default RootkNavigator;
