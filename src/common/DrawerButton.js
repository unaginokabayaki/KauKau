import React from 'react';
import { TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const DrawerButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(DrawerActions.toggleDrawer());
      }}
    >
      <Ionicons name="md-menu" size={36} style={{ paddingLeft: 10 }} />
    </TouchableOpacity>
  );
};

export default DrawerButton;
