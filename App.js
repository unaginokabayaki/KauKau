import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { StateContainer } from 'app/src/AppContext';

import RootNavigator from 'app/src/screens/RootStackNavigator';

export default function App() {
  return (
    <StateContainer.Provider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </StateContainer.Provider>
  );
}
