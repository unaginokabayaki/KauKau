import React from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';

import DrawerButton from 'app/src/common/DrawerButton';

import styles from './styles';

const Window = Dimensions.get('window');
const itemWidth = (Window.width - 10) / 3;

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
  const [itemList, setItemList] = React.useState([]);

  React.useEffect(() => {
    //ロード処理
    loadData();
  }, []);

  const loadData = () => {
    setItemList([1, 2, 3, 4, 5]);
  };

  renderItem = ({ item, index, separators }) => {
    return (
      <TouchableOpacity
        style={{
          width: itemWidth,
          height: itemWidth,
          borderWidth: 1,
          padding: 5,
        }}
        onPress={() => navigation.navigate('Item')}
      >
        <Text>image</Text>
        <Text>title</Text>
        <Text>price</Text>
        <Text>like</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={itemList}
        renderItem={renderItem}
        numColumns={3}
        keyExtractor={(item) => item.toString()}
      ></FlatList>
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
