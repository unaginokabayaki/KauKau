import React from 'react';
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  imageBox: {
    height: 64,
    width: 64,
    marginVertical: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.5,
  },
});
