import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { loadAsync } from 'expo-font';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { StateContainer } from 'app/src/AppContext';
import firebase from 'app/src/firebase';
import RootNavigator from 'app/src/screens/RootStackNavigator';

export default function App() {
  let [isLoading, setIsLoading] = React.useState(true);

  let timer = () => {
    return new Promise((resolve) => {
      setTimeout(resolve(console.log('done')), 5000);
    });
  };

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  loadResource = async () => {
    console.log('begin loadResource');
    // await wait(2000);
    let { user } = await firebase.checkLoginUser();
    console.log('end loadResource');
    return;
  };

  if (isLoading) {
    console.log('loading');
    return (
      <AppLoading
        startAsync={loadResource}
        onError={(error) => console.warn(error)}
        onFinish={() => setIsLoading(false)}
      />
    );
  }

  return (
    <StateContainer.Provider>
      {}
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </StateContainer.Provider>
  );
}
