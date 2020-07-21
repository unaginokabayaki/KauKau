import React from 'react';
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButtonStyle: {
    borderRadius: 14,
    backgroundColor: 'lightgray',
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  roundButtonTitleStyle: { fontSize: 12, fontWeight: '400', color: 'black' },
  roundButtonContainer: { marginTop: 6 },
  imageControlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageControlButtonText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
});
