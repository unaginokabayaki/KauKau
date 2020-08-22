import React, { useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StateContainer } from 'app/src/AppContext';
import { Ionicons } from '@expo/vector-icons';

import {
  Image,
  ListItem,
  Button,
  SearchBar,
  Icon,
} from 'react-native-elements';
import Swiper from 'react-native-swiper';

import DrawerButton from 'app/src/common/DrawerButton';
import firebase from 'app/src/firebase';
import styles from './styles';

const Window = Dimensions.get('window');
const numColumns = 3;
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
      <HomeStack.Screen name="Chat" component={ChatScreen} />
    </HomeStack.Navigator>
  );
};

const HomeScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();
  const [itemList, setItemList] = React.useState([]);
  const [cursor, setCursor] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const searchBarRef = React.useRef(null);

  React.useEffect(() => {
    // 初回ロード
    (async () => {
      await loadData();
    })();
  }, []);

  const loadData = async (text = '', cursor = null) => {
    setLoading(true);
    let res = await firebase.getItems(cursor, text);
    if (!res.error) {
      console.log(res.data.length);
      setItemList(cursor ? itemList.concat(res.data) : res.data);
      setCursor(res.cursor);
    }
    setLoading(false);
  };

  convertToCurrency = (num) => {
    return '¥' + num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  onEndReached = async () => {
    // 最後尾を表示したら次のデータロード
    console.log('this is the end');
    if (!loading && cursor) {
      await loadData(search, cursor);
    }
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

  searchItem = async (text) => {
    setSearch(text);
    await loadData(text);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        ref={searchBarRef}
        placeholder="Search by keyword"
        onChangeText={(text) => searchItem(text)}
        value={search}
        lightTheme={true}
        showCancel={true}
        onClear={() => searchItem('')}
        onCancel={() => null}
      />
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
          await loadData(search);
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
  const [like, setLike] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      let res = await firebase.getItem(itemId);
      if (!res.error) {
        // console.log(res.data);
        setItem(res.data);

        // いいね取得
        const liked = await firebase.isLikedItem(itemId);
        if (!liked.error) {
          setLike(liked.exists);
        }
      }
    })();
  }, []);

  const toggleLike = async () => {
    await firebase.toggleLike(itemId, !like);
    setLike(!like);
  };

  const likeIcon = (like) => {
    const LikeIconBase = (props) => {
      return (
        <Icon
          {...props}
          type={'ionicon'}
          size={14}
          containerStyle={{ marginRight: 5 }}
        />
      );
    };

    return like ? (
      <LikeIconBase name="md-heart" color="red" />
    ) : (
      <LikeIconBase name="md-heart-empty" color="gray" />
    );
  };

  const buyItem = () => {
    Alert.alert('購入しますか？', null, [
      { text: 'キャンセル' },
      { text: 'はい' },
      // { text: 'はい', onPress: firebase.buyItem(itemId) },
    ]);
  };

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
                  title={'いいね'}
                  buttonStyle={styles.roundButtonStyle}
                  titleStyle={styles.roundButtonTitleStyle}
                  containerStyle={styles.roundButtonContainer}
                  onPress={toggleLike}
                  icon={likeIcon(like)}
                />
                <Button
                  title="コメント"
                  buttonStyle={styles.roundButtonStyle}
                  titleStyle={styles.roundButtonTitleStyle}
                  containerStyle={styles.roundButtonContainer}
                  onPress={() =>
                    navigation.navigate('Chat', { itemId: itemId })
                  }
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
          onPress={buyItem}
        />
      </View>
    </View>
  );
};

import { GiftedChat, Send, Bubble, Message } from 'react-native-gifted-chat';

const ChatScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  let context = StateContainer.useContainer();
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      console.log(context.user);
      const result = await firebase.getComments(itemId);
      if (!result.error) {
        let messages = result.data.map((doc) => {
          return {
            _id: doc.id,
            text: doc.text,
            createdAt: doc.createdAt.toDate(),
            user: {
              _id: doc.userId,
              name: doc.user.name,
              avatar: doc.user.image_uri,
            },
          };
        });
        setMessages(messages.reverse());
      }
    })();

    // console.log(context.user);
    // setMessages(
    //   [
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    //       },
    //     },

    //     {
    //       _id: 2,
    //       text: 'Of course',
    //       createdAt: new Date(),
    //       user: {
    //         _id: context.user.uid,
    //         name: 'React Native',
    //         avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    //       },
    //     },
    //     {
    //       _id: 3,
    //       text: 'Nice too see you',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    //       },
    //     },
    //   ].reverse()
    // );
  }, []);

  const onSend = React.useCallback(async (messages = []) => {
    const res = await firebase.addComment(itemId, messages[0]);
    console.log(res);
    if (!res.error) {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            ...messages[0],
            _id: res.id,
            text: res.text,
            creaatedAt: res.createdAt,
          },
        ])
      );
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'lightgray' }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: context.user.id,
          name: 'ME',
          avatar: 'https://randomuser.me/api/portraits/lego/5.jpg',
        }}
        alignTop={true}
        showUserAvatar={true}
        renderUsernameOnMessage={true}
        // inverted={true}
        renderAvatarOnTop={true}
        // showAvatarForEveryMessage={true}
        alwaysShowSend={true}
        renderSend={(props) => (
          <Send {...props} containerStyle={{ justifyContent: 'center' }}>
            <Icon
              type="ionicon"
              name="md-send"
              color="green"
              containerStyle={{ marginRight: 5 }}
            />
          </Send>
        )}
        // renderAccessory={() => <Button title="picture" />}
        // renderChatEmpty={() => <Text>No message to show</Text>}
        bottomOffset={48}
        maxInputLength={140}
        scrollToBottom={true}
      />
    </View>
  );
};

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default HomeStackNavigator;
