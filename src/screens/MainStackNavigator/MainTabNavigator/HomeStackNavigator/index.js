import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';

import { Image, ListItem, Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';

import DrawerButton from 'app/src/common/DrawerButton';
import firebase from 'app/src/firebase';
import styles from './styles';

const Window = Dimensions.get('window');
const numColumns = 1;
const itemWidth = (Window.width - 10) / numColumns;

const HomeStack = createStackNavigator();
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator mode="modal">
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
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // 初回ロード
    (async () => {
      await loadData();
    })();
  }, []);

  const loadData = async (cursor = null) => {
    setLoading(true);
    let res = await firebase.getItems(cursor);
    if (!res.error) {
      console.log(res.data.length);
      if (res.cursor) {
        setItemList(cursor ? itemList.concat(res.data) : res.data);
        setCursor(res.cursor);
      }
    }
    setLoading(false);
  };

  convertToCurrency = (num) => {
    return '¥' + num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  onEndReached = async () => {
    // 最後尾を表示したら次のデータロード
    console.log('this is the end');
    await loadData(cursor);
  };

  renderItem = ({ item, index, separators }) => {
    return (
      <TouchableOpacity
        style={{
          width: itemWidth,
          height: itemWidth,
          padding: 2,
        }}
        onPress={() => navigation.navigate('Item', { itemId: item.id })}
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
        onEndReachedThreshold={0}
        onEndReached={onEndReached}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await loadData();
          setRefreshing(false);
        }}
        ListFooterComponent={
          loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View>
            <Text style={{ fontSize: 16, padding: 32 }}>
              該当するアイテムがありません
            </Text>
          </View>
        }
      ></FlatList>
    </View>
  );
};

const ItemScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [item, setItem] = React.useState({});

  React.useEffect(() => {
    (async () => {
      let res = await firebase.getItem(itemId);
      if (!res.error) {
        // console.log(res.data);
        setItem(res.data);
      }
    })();
  }, []);

  return (
    <View style={{ justifyContent: 'flex-end' }}>
      <ScrollView>
        <View style={{ backgroundColor: 'white' }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {item.image_uri && (
              <Swiper
                style={{
                  height: Window.width,
                }}
                loop={false}
                showsButtons={true}
                dotColor="rgba(255,255,255,0.2)"
                activeDotColor="rgba(255,255,255,0.8)"
                nextButton={
                  <Text
                    style={{ color: 'rgba(255,255,255,0.8)', fontSize: 48 }}
                  >
                    ›
                  </Text>
                }
                prevButton={
                  <Text
                    style={{ color: 'rgba(255,255,255,0.8)', fontSize: 48 }}
                  >
                    ‹
                  </Text>
                }
              >
                {item.image_uri?.map((v, i) => {
                  return (
                    <Image
                      key={i.toString()}
                      source={{ uri: item.image_uri?.[i] }}
                      style={{
                        height: Window.width,
                        width: Window.width,
                        resizeMode: 'contain',
                      }}
                    ></Image>
                  );
                })}
              </Swiper>
            )}
          </View>

          <View style={{ margin: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                paddingTop: 6,
              }}
            >
              {item.title}
              {
                'describes how to shrink children along the main axis in the case in which the total'
              }
            </Text>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Button
                  title="いいね"
                  buttonStyle={styles.roundButtonStyle}
                  titleStyle={styles.roundButtonTitleStyle}
                  containerStyle={styles.roundButtonContainer}
                />
                <Button
                  title="コメント"
                  buttonStyle={styles.roundButtonStyle}
                  titleStyle={styles.roundButtonTitleStyle}
                  containerStyle={styles.roundButtonContainer}
                />
              </View>
              <Button
                title="＞"
                buttonStyle={styles.roundButtonStyle}
                titleStyle={styles.roundButtonTitleStyle}
                containerStyle={[styles.roundButtonContainer]}
              />
            </View>
          </View>
        </View>
        <View style={{ height: 200 }}>
          <Text>商品情報</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={{ marginVertical: 10 }}>{item.description}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 10 }}></View>
        <View style={{ height: 120 }}>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ListItem
              title="カテゴリ"
              bottomDivider
              rightElement={<Text>{item.category}</Text>}
            />
            <ListItem
              title="状態"
              bottomDivider
              rightElement={<Text>{item.condition}</Text>}
            />
          </View>
        </View>
        <View style={{ height: 120 }}>
          <Text>出品者</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ListItem
              title="出品者"
              bottomDivider
              rightElement={<Text>{item.id}</Text>}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          backgroundColor: '#491313',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}
      >
        <View>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '500' }}>
            {'送料込み'}
          </Text>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: '600' }}>
            {convertToCurrency(item.item_price || 0)}
          </Text>
        </View>
        <Button
          title="購入手続きへ"
          buttonStyle={{ backgroundColor: '#E8392E' }}
          titleStyle={{ fontSize: 14, fontWeight: '500' }}
        />
      </View>
    </View>
  );
};

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default HomeStackNavigator;
