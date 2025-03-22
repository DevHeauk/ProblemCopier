import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
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

  console.log('DEBUG11', device, hasPermission);
  if (!device) return <Text>No camera available</Text>;
  if (!hasPermission) return <Text>No permission</Text>;

  const savePhotoToGallery = async (path: string) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('권한 거부됨', '사진을 저장하려면 권한이 필요합니다.');
          return;
        }
      }

      const uri = 'file://' + path;
      await CameraRoll.saveAsset(uri);

      Alert.alert('✅ 저장 완료', '사진이 갤러리에 저장되었습니다!');
    } catch (error) {
      console.error('❌ 저장 실패:', error);
      Alert.alert('저장 실패', '사진 저장 중 오류가 발생했습니다.');
    }
  };

  const takePhoto = async () => {
    try {
      if (camera.current) {
        const photo: PhotoFile = await camera.current.takePhoto();
        if (photo?.path) {
          console.log('📸 찍은 사진 경로:', photo.path);
          await savePhotoToGallery(photo.path);
        }
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
        onError={error => {
          console.error('❌ Camera Error:', error);
        }}
      />
      <TouchableOpacity onPress={takePhoto} style={styles.button}>
        <Text style={styles.buttonText}>📸 찍기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  camera: {...StyleSheet.absoluteFillObject},
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
