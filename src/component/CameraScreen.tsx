import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Camera, useCameraDevices, PhotoFile} from 'react-native-vision-camera';

const CameraScreen: React.FC = () => {
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  const camera = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    })();
  }, []);

  if (!device) return <Text>No camera available</Text>;
  if (!hasPermission) return <Text>No permission</Text>;

  const takePhoto = async () => {
    try {
      if (camera.current) {
        const photo: PhotoFile = await camera.current.takePhoto();
        Alert.alert('Photo Taken!', `Saved at: ${photo.path}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <TouchableOpacity onPress={takePhoto} style={styles.button}>
        <Text style={styles.buttonText}>📸 찍기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  camera: {flex: 1},
  button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
  },
  buttonText: {fontSize: 18, fontWeight: 'bold'},
});

export default CameraScreen;
