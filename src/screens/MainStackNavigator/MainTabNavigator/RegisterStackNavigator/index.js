import React from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Dimensions,
  TextInput,
  FlatList,
  ActionSheetIOS,
  Image,
} from 'react-native';
import { createStackNavigator, useHeaderHeight } from '@react-navigation/stack';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import DrawerButton from 'app/src/common/DrawerButton';

import { ListItem, Button } from 'react-native-elements';

import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

import { DragSortableView, AutoDragSortableView } from 'react-native-drag-sort';

import firebase from 'app/src/firebase';

const numOfImage = 5;

const window = Dimensions.get('window');
const childrenWidth = 76;
const childrenHeight = 76;
// const parentWidth = childrenWidth * numOfImage;
const marginChildrenTop = 0;
const marginChildrenBottom = 0;
const marginChildrenLeft = 0;
const marginChildrenRight = 0;

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
      <RegisterStack.Screen
        name="Category"
        component={SelectCategoryScreen}
        options={{
          headerBackTitle: 'キャンセル',
        }}
      />
      <RegisterStack.Screen
        name="Condition"
        component={SelectConditionScreen}
        options={{
          headerBackTitle: 'キャンセル',
        }}
      />
    </RegisterStack.Navigator>
  );
};

const RegisterScreen = ({ navigation, route }) => {
  let [data, setData] = React.useState([]);

  let [isScrollEnabled, setScrollEnabled] = React.useState(true);
  let [parentWidth, setParentWidth] = React.useState(0);

  // 入力項目
  let [form, setForm] = React.useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: 0,
  });

  // 表示用（価格）
  let [formattedPrice, setFormattedPrice] = React.useState('');

  // 文字カウンター
  let [wordCounter, setWordCounter] = React.useState({
    title: 0,
    description: 0,
  });

  const headerHeight = useHeaderHeight();

  React.useEffect(() => {
    let newdata = [
      // { uri: 'test.png' },
      // { uri: 'test.png' },
      // { uri: 'test.png' },
    ];
    setData(newdata);
    setParentWidth(imageFlameWidth(newdata));
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('register screen get focused');
    });
  }, [navigation]);

  // 選択画面での選択値を受け取って更新
  React.useEffect(() => {
    if (route.params?.category) {
      setForm({ ...form, category: route.params.category });
    }
    if (route.params?.condition) {
      setForm({ ...form, condition: route.params.condition });
    }
  }, [route.params?.category, route.params?.condition]);

  // フォーマット済み価格が変更されたら、メモリ上で戻す
  React.useEffect(() => {
    const price = convertFromCurrency(formattedPrice);
    // console.log(p);
    setForm({ ...form, price: price });
  }, [formattedPrice]);

  React.useLayoutEffect(() => {}, []);

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      // const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('写真にアクセスする権限がありません。');
        throw 'permission denied';
      }
    }
  };

  pickImage = async () => {
    try {
      await getPermissionAsync();

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log(result);

      if (result.cancelled) {
        throw 'cancelled';
      }

      return result.uri;
    } catch (e) {
      console.log(e);
      return '';
    }
  };

  addImage = (uri) => {
    let newdata = [...data];
    newdata.push({ uri: uri });
    setData(newdata);
    setParentWidth(imageFlameWidth(newdata));
  };

  changeImage = async (index) => {
    const uri = await pickImage();
    if (uri) {
      let newdata = [...data];
      newdata[index] = { uri: uri };
      setData(newdata);
      setParentWidth(imageFlameWidth(newdata));
    }
  };

  const AddImageNew = () => {
    showActionSheet = () => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['キャンセル', 'アルバムから選択', 'カメラで撮影'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            return;
          } else if (buttonIndex === 1) {
            // addData('logo.png');
            const uri = await pickImage();
            if (uri) {
              addImage(uri);
            }
          } else if (buttonIndex === 2) {
          }
        }
      );
    };

    return (
      <TouchableOpacity
        style={{
          ...styles.imageBox,
          backgroundColor: 'tomato',
        }}
        onPress={showActionSheet}
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

  const AddImageDone = () => {
    return (
      <TouchableOpacity
        style={{
          ...styles.imageBox,
        }}
      >
        {/* <Image></Image> */}
      </TouchableOpacity>
    );
  };

  renderItem = (item, index) => {
    console.log(item);
    return (
      <TouchableOpacity
        style={{
          ...styles.imageBox,
        }}
      >
        <Image source={{ uri: item.uri }} style={{ ...styles.imageBox }} />
      </TouchableOpacity>
    );
  };

  renderEmptyBox = () => {
    let count = numOfImage - data.length;

    let render = [];
    for (let i = 0; i < count; i++) {
      if (i == 0) {
        render.push(<AddImageNew key={i.toString()} data={data} />);
      } else {
        render.push(<AddImageEmpty key={i.toString()} />);
      }
    }

    return <>{render}</>;
  };

  imageFlameWidth = (data) => {
    return childrenWidth * data.length;
  };

  const SelectedCategory = () => {
    if (form.category == '') {
      return <Text style={{ color: 'silver' }}>(任意)</Text>;
    } else {
      return <Text>{form.category}</Text>;
    }
  };

  const SelectedCondition = () => {
    if (form.condition == '') {
      return <Text style={{ color: 'silver' }}>(必須)</Text>;
    } else {
      return <Text>{form.condition}</Text>;
    }
  };

  const InputPrice = () => {
    return (
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <TextInput
          keyboardType="number-pad"
          placeholder="¥300 ~ ¥1,000,000"
          value={formattedPrice}
          onFocus={() => {
            setFormattedPrice(convertFromCurrency(formattedPrice));
          }}
          onChangeText={(text) => {
            setFormattedPrice(text);
          }}
          onBlur={() => {
            if (formattedPrice != '') {
              setFormattedPrice(convertToCurrency(formattedPrice));
            }
          }}
          returnKeyType={'done'}
          onSubmitEditing={() => {}}
        />
      </View>
    );
  };

  convertToCurrency = (num) => {
    return '¥' + num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  convertFromCurrency = (num) => {
    let temp = num.replace('¥', '');
    temp = temp.replace(',', '');
    temp = temp.replace(' ', '');
    return temp;
  };

  const DealingFee = () => {
    let ans = form.price * 0.05;
    ans = Math.floor(ans);

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
        }}
      >
        <Text style={{ color: 'silver' }}>{convertToCurrency(ans)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView>
        <View style={{ height: 110 }}>
          <Text>画像</Text>
          <ScrollView horizontal scrollEnabled={isScrollEnabled}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              {parentWidth >= childrenWidth && (
                <DragSortableView
                  dataSource={data}
                  parentWidth={imageFlameWidth(data)}
                  childrenWidth={childrenWidth}
                  childrenHeight={childrenHeight}
                  marginChildrenTop={marginChildrenTop}
                  marginChildrenBottom={marginChildrenBottom}
                  marginChildrenLeft={marginChildrenLeft}
                  marginChildrenRight={marginChildrenRight}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  onClickItem={(data, item, index) => {
                    changeImage(index);
                  }}
                  onDataChange={(data) => {}}
                  onDragStart={(startIndex, endIndex) => {
                    setScrollEnabled(false);
                  }}
                  onDragEnd={(startIndex) => {
                    setScrollEnabled(true);
                  }}
                />
              )}
              {renderEmptyBox()}
            </View>
          </ScrollView>
        </View>
        <View style={{ height: 40 }}>
          <Text style={{ height: 20 }}>バーコード出品</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}></View>
        </View>
        <View style={{ height: 200 }}>
          <Text>商品名と説明</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'lightgray',
                marginHorizontal: 10,
              }}
            >
              <TextInput
                style={{ marginTop: 15 }}
                maxLength={30}
                value={form.title}
                onChangeText={(text) => {
                  // 文字を数える
                  let len = text.length;
                  setWordCounter({ ...wordCounter, title: len });
                  // value更新
                  setForm({ ...form, title: text });
                }}
                placeholder={'タイトル'}
                returnKeyType={'done'}
              />
              <Text
                style={{
                  color: 'silver',
                  textAlign: 'right',
                  marginRight: 5,
                }}
              >
                {wordCounter.title}/30
              </Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10 }}>
              <TextInput
                style={{ flex: 1 }}
                multiline
                maxLength={1000}
                value={form.description}
                onChangeText={(text) => {
                  // 文字を数える
                  let len = text.length;
                  setWordCounter({ ...wordCounter, description: len });
                  // value更新
                  setForm({ ...form, description: text });
                }}
                placeholder={'商品説明を記載してください。'}
              />
              <Text
                style={{ color: 'silver', textAlign: 'right', marginRight: 5 }}
              >
                {wordCounter.description}/1000
              </Text>
            </View>
          </View>
        </View>
        <View style={{ height: 120 }}>
          <Text>商品情報</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ListItem
              title="カテゴリ"
              bottomDivider
              chevron
              onPress={() => navigation.navigate('Category')}
              rightElement={SelectedCategory()}
            />
            <ListItem
              title="状態"
              bottomDivider
              chevron
              onPress={() => navigation.navigate('Condition')}
              rightElement={SelectedCondition()}
            />
          </View>
        </View>
        <View style={{ height: 120 }}>
          <Text>価格</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ListItem
              style={{ backgroundColor: 'white' }}
              title="商品価格"
              bottomDivider
              rightElement={InputPrice()}
            />
            <ListItem
              containerStyle={{ backgroundColor: 'whitesmoke' }}
              title="手数料(5%)"
              bottomDivider
              rightElement={DealingFee()}
            />
          </View>
        </View>
        <View
          style={{
            height: 100,
            flexDirection: 'row',
            backgroundColor: 'white',
          }}
        >
          <Button
            title="下書きに保存する"
            type="outline"
            containerStyle={{ flex: 1, margin: 10 }}
            buttonStyle={{ borderColor: 'tomato' }}
            titleStyle={{ color: 'tomato' }}
            onPress={() => {
              firebase.registerItem(form);
              alert('下書き保存しました');
            }}
          />
          <Button
            title="確認する"
            containerStyle={{ flex: 1, margin: 10 }}
            buttonStyle={{ backgroundColor: 'tomato' }}
            onPress={() => alert('確認')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SelectCategoryScreen = ({ navigation, route }) => {
  const list = [
    { title: '書籍・CD・DVD' },
    { title: '家電・スマホ・PC' },
    { title: 'ゲーム・おもちゃ' },
    { title: '衣服・靴' },
    { title: 'その他' },
  ];

  renderItem = ({ item }) => {
    return (
      <ListItem
        title={item.title}
        bottomDivider
        onPress={() => {
          // 遷移元から渡した関数を呼ぶ
          // route.params.setCategory(item.title);
          // navigation.goBack();
          // 元画面に返す
          navigation.navigate('Register', { category: item.title });
        }}
      />
    );
  };

  return (
    <FlatList
      data={list}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    ></FlatList>
  );
};

const SelectConditionScreen = ({ navigation, route }) => {
  const list = [
    { title: '新品・未使用', id: 1 },
    { title: '未使用に近い', id: 2 },
    { title: '目立った傷や汚れなし', id: 3 },
    { title: 'やや傷や汚れあり', id: 4 },
    { title: '傷や汚れあり', id: 5 },
    { title: '全体的に状態が悪い', id: 6 },
  ];

  renderItem = ({ item }) => {
    return (
      <ListItem
        title={item.title}
        bottomDivider
        onPress={() => {
          // 元画面に返す
          navigation.navigate('Register', { condition: item.title });
        }}
      />
    );
  };

  return (
    <FlatList
      data={list}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    ></FlatList>
  );
};

export default RegisterStackNavigator;
