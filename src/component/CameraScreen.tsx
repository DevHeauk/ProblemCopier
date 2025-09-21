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
  ActivityIndicator,
  Modal,
} from 'react-native';
import {Camera, useCameraDevices, PhotoFile} from 'react-native-vision-camera';
import { config } from '../../config';
import ResultScreen from './ResultScreen';

const CameraScreen: React.FC = () => {
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  const camera = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    })();
  }, []);

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

  const sendImageToAPI = async (photoPath: string) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: Platform.OS === 'ios' ? photoPath : 'file://' + photoPath,
        type: 'image/jpeg',
        name: 'photo.jpg'
      } as any);

      const response = await fetch(`${config.API_URL}/api/math/analyze-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('API 응답:', result);

      if (result.data?.htmlContent) {
        setHtmlContent(result.data.htmlContent);
        setShowResult(true);
      } else {
        Alert.alert(
          '분석 완료',
          `원본 문제: ${result.data?.originalProblem || 'N/A'}\n\n유사 문제 ${result.data?.similarProblems?.length || 0}개 생성됨`
        );
      }

      return result;
    } catch (error) {
      console.error('API 호출 실패:', error);
      Alert.alert('오류', 'API 서버에 연결할 수 없습니다.');
      throw error;
    }
  };

  const takePhoto = async () => {
    try {
      if (camera.current) {
        setIsLoading(true);
        const photo: PhotoFile = await camera.current.takePhoto();
        if (photo?.path) {
          console.log('📸 찍은 사진 경로:', photo.path);

          // API 서버로 이미지 전송
          await sendImageToAPI(photo.path);

          // 갤러리에도 저장
          // await savePhotoToGallery(photo.path);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setHtmlContent(null);
  };

  return (
    <View style={styles.container}>
      {showResult && htmlContent ? (
        <ResultScreen
          htmlContent={htmlContent}
          onClose={handleCloseResult}
        />
      ) : (
        <>
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
          <TouchableOpacity
            onPress={takePhoto}
            style={[styles.button, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.buttonText}>📸 찍기</Text>
            )}
          </TouchableOpacity>
        </>
      )}
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
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {fontSize: 18, fontWeight: 'bold'},
});

export default CameraScreen;
