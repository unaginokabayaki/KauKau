import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerButton from 'app/src/common/DrawerButton';

import styles from './styles';

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
    <View>
      <Text>AboutScreen</Text>
    </View>
  );
};

export default AboutStackNavigator;
