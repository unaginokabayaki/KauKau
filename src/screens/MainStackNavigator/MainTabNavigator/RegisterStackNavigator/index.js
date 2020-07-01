import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerButton from 'app/src/common/DrawerButton';

import { ListItem } from 'react-native-elements';

import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

import { DragSortableView, AutoDragSortableView } from 'react-native-drag-sort';
import { List } from 'native-base';

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
    </RegisterStack.Navigator>
  );
};

const RegisterScreen = ({ navigation, route }) => {
  let [data, setData] = React.useState([]);
  // let [numOfImage] = React.useState(10);
  let [isScrollEnabled, setScrollEnabled] = React.useState(true);
  let [parentWidth, setParentWidth] = React.useState(0);

  let [category, setCategory] = React.useState('');

  React.useEffect(() => {
    let newdata = [
      // { image: 'test.png' },
      // { image: 'test.png' },
      // { image: 'test.png' },
    ];
    setData(newdata);
    setParentWidth(childrenWidth * newdata.length);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('register screen get focused');
    });
  }, [navigation]);

  // 選択画面での選択値を受け取る
  React.useEffect(() => {
    if (route.params?.category) {
      setCategory(route.params.category);
    }
  }, [route.params?.category]);

  React.useLayoutEffect(() => {}, []);

  const AddImageNew = () => {
    addData = () => {
      let newdata = [...data];
      newdata.push({ image: 'test.png' });
      setData(newdata);
      setParentWidth(childrenWidth * newdata.length);
    };

    return (
      <TouchableOpacity
        style={{
          ...styles.imageBox,
          backgroundColor: 'tomato',
        }}
        onPress={addData}
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
    return (
      <View
        style={{
          ...styles.imageBox,
        }}
      >
        {/* <Image></Image> */}
      </View>
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

  // imageFlameWidth = () => {
  //   return childrenWidth * data.length;
  // };

  const SelectedCategory = () => {
    if (category == '') {
      return <Text style={{ color: 'silver' }}>(必須)</Text>;
    } else {
      return <Text>{category}</Text>;
    }
  };

  selectCategoryCallback = () => {
    console.log('sss');
  };

  return (
    <SafeAreaView style={styles.container}>
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
                  parentWidth={parentWidth}
                  childrenWidth={childrenWidth}
                  childrenHeight={childrenHeight}
                  marginChildrenTop={marginChildrenTop}
                  marginChildrenBottom={marginChildrenBottom}
                  marginChildrenLeft={marginChildrenLeft}
                  marginChildrenRight={marginChildrenRight}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item, index) => {
                    return renderItem(item, index);
                  }}
                  onClickItem={(data, item, index) => {
                    alert(item.image);
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
              <TextInput style={{ marginTop: 15 }} maxLength={30} />
              <Text
                style={{
                  color: 'silver',
                  textAlign: 'right',
                  marginRight: 5,
                }}
              >
                1/30
              </Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10 }}>
              <TextInput style={{ flex: 1 }} multiline maxLength={1000} />
              <Text
                style={{ color: 'silver', textAlign: 'right', marginRight: 5 }}
              >
                1/1000
              </Text>
            </View>
          </View>
        </View>
        <View style={{ height: 200 }}>
          <Text>商品情報</Text>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ListItem
              title="カテゴリ"
              bottomDivider
              chevron
              onPress={() => navigation.navigate('Category')}
              rightElement={SelectedCategory()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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

export default RegisterStackNavigator;
