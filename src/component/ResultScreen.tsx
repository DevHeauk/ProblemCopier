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
import RenderHtml, { CustomRendererProps } from 'react-native-render-html';

interface ResultScreenProps {
  htmlContent: string;
  onClose: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ htmlContent, onClose }) => {
  const contentWidth = Dimensions.get('window').width - 40;


  // span 태그를 위한 커스텀 렌더러 (태그 스타일링용)
  const spanRenderer = ({ TDefaultRenderer, ...props }: CustomRendererProps<any>) => {
    const { tnode } = props;
    const text = tnode.children?.[0]?.data || '';
    
    // 배경색과 스타일 추출
    const style = tnode.attributes?.style || '';
    const isTag = style.includes('background:') && style.includes('color: white');
    
    if (isTag) {
      return (
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{text}</Text>
        </View>
      );
    }
    
    return <TDefaultRenderer {...props} />;
  };

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
          renderers={{
            span: spanRenderer,
          }}
          tagsStyles={{
            body: {
              color: '#333',
              fontSize: 16,
            },
            h1: {
              fontSize: 24,
              marginBottom: 10,
              color: '#2c3e50',
              fontWeight: 'bold',
            },
            h2: {
              fontSize: 22,
              marginBottom: 8,
              color: '#2c3e50',
              fontWeight: 'bold',
            },
            h3: {
              fontSize: 20,
              marginBottom: 6,
              color: '#2c3e50',
              fontWeight: 'bold',
            },
            h4: {
              fontSize: 18,
              marginBottom: 10,
              color: '#2c3e50',
              fontWeight: 'bold',
            },
            p: {
              marginBottom: 10,
              lineHeight: 24,
              fontSize: 16,
              color: '#333',
            },
            div: {
              marginBottom: 10,
            },
            strong: {
              fontWeight: 'bold',
              color: '#2c3e50',
            },
            h5: {
              fontSize: 16,
              marginBottom: 10,
              color: '#3498db',
              fontWeight: 'bold',
            }

          }}
          enableExperimentalMarginCollapsing={true}
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
  tagContainer: {
    backgroundColor: '#3498db',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ResultScreen;