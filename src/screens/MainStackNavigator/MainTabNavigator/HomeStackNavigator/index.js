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

import { Image } from 'react-native-elements';

import DrawerButton from 'app/src/common/DrawerButton';
import firebase from 'app/src/firebase';
import styles from './styles';

const Window = Dimensions.get('window');
const numColumns = 1;
const itemWidth = (Window.width - 10) / numColumns;

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
  const [cursor, setCursor] = React.useState(null);

  React.useEffect(() => {
    // 初回ロード
    loadData();
  }, []);

  const loadData = async (cursor = null) => {
    let res = await firebase.getItems(cursor);
    if (!res.error) {
      console.log(res.data.length);
      if (res.cursor) {
        setItemList(itemList.concat(res.data));
        setCursor(res.cursor);
      }
    }
  };

  convertToCurrency = (num) => {
    return '¥' + num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  onEndReached = () => {
    // 最後尾を表示したら次のデータロード
    console.log('this is the end');
    loadData(cursor);
  };

  renderItem = ({ item, index, separators }) => {
    return (
      <TouchableOpacity
        style={{
          width: itemWidth,
          height: itemWidth,
          padding: 2,
        }}
        onPress={() => navigation.navigate('Item')}
      >
        <Image
          source={{ uri: item.image_uri[0] }}
          style={{
            width: itemWidth - 4,
            height: itemWidth - 4,
            borderRadius: 4,
            resizeMode: 'contain',
          }}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: 4,
              }}
            >
              {convertToCurrency(item.item_price || 0)}
            </Text>
          </View>
        </Image>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={itemList}
        renderItem={renderItem}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
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
