import React from 'react';
import { Text, View, Button, TouchableOpacity, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';

import DrawerButton from 'app/src/common/DrawerButton';

import styles from './styles';

const HomeStack = createStackNavigator();
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
      <HomeStack.Screen name="Item" component={ItemScreen} />
    </HomeStack.Navigator>
  );
};

const HomeScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>HomeScreen</Text>
        <Button
          title="Item"
          onPress={() => navigation.navigate('Item')}
        ></Button>
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
        ></Button>
        <Button
          title="Help"
          onPress={() => navigation.navigate('Help')}
        ></Button>
      </ScrollView>
    </View>
  );
};

const ItemScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>ItemScreen</Text>
    </View>
  );
};

export default HomeStackNavigator;
