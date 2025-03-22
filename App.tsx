import React from 'react';
import {StyleSheet, View} from 'react-native';

import CameraScreen from './src/component/CameraScreen';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <CameraScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
