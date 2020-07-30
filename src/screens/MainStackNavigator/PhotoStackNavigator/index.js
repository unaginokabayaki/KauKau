import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Icon, Image } from 'react-native-elements';

import { StateContainer } from 'app/src/AppContext';

import styles from './styles';

const Window = Dimensions.get('window');

const PhotoStack = createStackNavigator();
const PhotoStackNavigator = () => {
  return (
    <PhotoStack.Navigator>
      <PhotoStack.Screen
        name="TakePhoto"
        component={TakePhotoScreen}
        // options={({ navigation }) => ({})}
      />
    </PhotoStack.Navigator>
  );
};

const TakePhotoScreen = ({ navigation }) => {
  let context = StateContainer.useContainer();
  const cameraRef = React.useRef(null);
  const [isCameraReady, setIsCameraReady] = React.useState(false);
  const [hasPermission, setHasPermission] = React.useState(null);
  const [type, setType] = React.useState(Camera.Constants.Type.back);

  const [images, setImages] = React.useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button title="キャンセル" onPress={() => navigation.goBack()} />
      ),
      headerRight: () => (
        <Button
          title="完了"
          onPress={() =>
            navigation.navigate('RegisterStack', {
              screen: 'Register',
              params: { images: images },
            })
          }
        />
      ),
    });
  });

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      // const size = await cameraRef?.current.getAvailablePictureSizesAsync(
      //   '1:1'
      // );
      // console.log(size);
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.containerEmpty}>
        <Text>Something went wrong</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.containerEmpty}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        let photo = await cameraRef?.current.takePictureAsync({
          quality: 1.0,
          exif: false,
        });
        console.log(photo);

        const newImages = [...images];
        newImages.push(photo);
        setImages(newImages);
        // use FileSystem to make permanent
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={cameraRef}
        type={type}
        ratio="1:1"
        // pictureSize="Low"
        onCameraReady={() => setIsCameraReady(true)}
        onMountError={(e) => console.log(e.message)}
      >
        <LightButton style={{ alignSelf: 'flex-end', margin: 20 }} />
      </Camera>
      <View
        style={{
          height: 90,
          flexDirection: 'row',
          // alignItems: 'center',
        }}
      >
        <ScrollView horizontal>
          {[0, 1, 2, 3, 4].map((v, i) => {
            return <ImageFrame uri={images[i]?.uri} key={i.toString()} />;
          })}
        </ScrollView>
      </View>
      <View
        style={{
          height: 90,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          margin: 5,
          // borderWidth: 1,
        }}
      >
        <AlbumButton onPress={null} />
        <CameraButton onPress={takePicture} disabled={!isCameraReady} />
        <ReverseButton onPress={null} />
      </View>
      <View style={{ marginBottom: 10 }}></View>
    </View>
  );
};

const ImageFrame = (props) => {
  return (
    <Image
      source={{ uri: props.uri }}
      style={{
        width: 80,
        height: 80,
        borderRadius: 5,
        overflow: 'hidden',
      }}
      resizeMode="contain"
      containerStyle={{
        // borderRadius: 5,
        // borderWidth: 1,
        margin: 5,
      }}
    ></Image>
  );
};

const CameraButton = (props) => {
  return (
    <TouchableOpacity {...props}>
      <View
        style={{
          borderWidth: 2,
          width: 80,
          height: 80,
          borderRadius: 40,
          borderColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            borderWidth: 1,
            width: 60,
            height: 60,
            borderRadius: 30,
            borderColor: 'black',
            backgroundColor: 'white',
          }}
        ></View>
      </View>
    </TouchableOpacity>
  );
};

const ReverseButton = (props) => {
  return (
    <TouchableOpacity {...props}>
      <Icon
        type="ionicon"
        name="ios-reverse-camera"
        size={42}
        color={'black'}
      />
    </TouchableOpacity>
  );
};

const AlbumButton = (props) => {
  return (
    <TouchableOpacity {...props}>
      <Icon type="ionicon" name="md-photos" size={36} color={'black'} />
    </TouchableOpacity>
  );
};

const LightButton = (props) => {
  return (
    <TouchableOpacity {...props}>
      <Icon
        type="ionicon"
        name="ios-flash-off"
        size={32}
        color={'rgba(255,255,255,0.5)'}
        // containerStyle={{ margin: 20 }}
      />
    </TouchableOpacity>
  );
};

export default PhotoStackNavigator;
