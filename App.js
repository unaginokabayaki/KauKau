import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { loadAsync } from 'expo-font';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { StateContainer } from 'app/src/AppContext';

import RootNavigator from 'app/src/screens/RootStackNavigator';

export default function App() {
  let [isLoading, setIsLoading] = React.useState(true);

  if (isLoading) {
    return <AppLoading onFinish={setIsLoading(false)} />;
  }

  return (
    <StateContainer.Provider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </StateContainer.Provider>
  );
}
