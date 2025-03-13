import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import CameraScreen from './src/component/CameraScreen';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text>안녕하세요</Text>
      <CameraScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
