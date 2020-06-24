import React from 'react';
import { SafeAreaView, ScrollView, Text, View, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerButton from 'app/src/common/DrawerButton';

import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

import { DragSortableView, AutoDragSortableView } from 'react-native-drag-sort';

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
    </RegisterStack.Navigator>
  );
};

const RegisterScreen = () => {
  let [data, setData] = React.useState([]);
  // let [numOfImage] = React.useState(10);
  let [isScrollEnabled, setScrollEnabled] = React.useState(true);
  let [parentWidth, setParentWidth] = React.useState(0);

  React.useEffect(() => {
    let newdata = [
      { image: 'test.png' },
      { image: 'test.png' },
      { image: 'test.png' },
    ];
    setData(newdata);
    setParentWidth(childrenWidth * newdata.length);
  }, []);

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
