import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerButton from 'app/src/common/DrawerButton';

import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

const RegisterStack = createStackNavigator();
const RegisterStackNavigator = () => {
  return (
    <RegisterStack.Navigator>
      <RegisterStack.Screen
        name="Register"
        component={RegisterScreen}
        options={({ navigation }) => ({
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </RegisterStack.Navigator>
  );
};

const AddImageNew = () => {
  return (
    <TouchableOpacity
      style={{
        ...styles.imageBox,
        backgroundColor: 'tomato',
      }}
    >
      <Icon type="antdesign" name="plus" color="white" size={32} />
    </TouchableOpacity>
  );
};

const AddImageEmpty = () => {
  return (
    <TouchableOpacity
      style={{
        ...styles.imageBox,
        backgroundColor: 'grey',
      }}
    ></TouchableOpacity>
  );
};

// const AddImageDone = () => {
//   return (
//     <TouchableOpacity
//       style={{
//         ...styles.imageBox,
//       }}
//     >
//       <Image></Image>
//     </TouchableOpacity>
//   );
// };

const RegisterScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ height: 120 }}>
          <Text>画像</Text>
          <ScrollView horizontal>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <AddImageNew />
              <AddImageEmpty />
              <AddImageEmpty />
              <AddImageEmpty />
              <AddImageEmpty />
              <AddImageEmpty />
              <AddImageEmpty />
            </View>
          </ScrollView>
        </View>
        <View style={{ height: 40 }}>
          <Text style={{ height: 20 }}>バーコード出品</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}></View>
        </View>
        <View style={{ height: 200 }}>
          <Text>商品名と説明</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}></View>
        </View>
        <View style={{ height: 200 }}>
          <Text>商品情報</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterStackNavigator;
