import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

interface ResultScreenProps {
  htmlContent: string;
  onClose: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ htmlContent, onClose }) => {
  const contentWidth = Dimensions.get('window').width - 40;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>문제 분석 결과</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: htmlContent }}
          tagsStyles={{
            body: {
              color: '#333',
              fontSize: 16,
            },
            h1: {
              fontSize: 24,
              marginBottom: 10,
            },
            h2: {
              fontSize: 22,
              marginBottom: 8,
            },
            h3: {
              fontSize: 20,
              marginBottom: 6,
            },
            p: {
              marginBottom: 10,
              lineHeight: 24,
            },
            div: {
              marginBottom: 10,
            },
            strong: {
              fontWeight: 'bold',
            },
          }}
        />
      </ScrollView>

      <TouchableOpacity onPress={onClose} style={styles.newPhotoButton}>
        <Text style={styles.newPhotoButtonText}>새 사진 찍기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  newPhotoButton: {
    backgroundColor: '#3498db',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  newPhotoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultScreen;