import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
import baseURL from '../../config';

const EditLessonPlan = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();
  const route = useRoute();
  const {lessonPlanId} = route.params;

  const [lessonPlanTitle, setLessonPlanTitle] = useState('');
  const [lessonPlanPdf, setLessonPlanPdf] = useState(null);

  // useEffect(() => {
  //   const fetchLessonPlan = async () => {
  //     try {
  //       const response = await fetch(`${baseURL}/LessonPlan/getLessonPlanById?id=${lessonPlanId}`);
  //       const result = await response.json();
  //       console.log('Fetch Lesson Plan Result:', result); // Debugging log
  //       if (result.status === 'Success') {
  //         setLessonPlanTitle(result.data.lessonPlanTitle);
  //         setLessonPlanPdf(result.data.lessonPlanPdfPatn); // Assuming it's a URL or path
  //       } else {
  //         Alert.alert('Error', result.message || 'Failed to fetch lesson plan'); // Default error message
  //       }
  //     } catch (error) {
  //       console.error('Fetch Lesson Plan Error: ', error);
  //       Alert.alert('Error', 'Failed to fetch lesson plan');
  //     }
  //   };

  //   fetchLessonPlan();
  // }, [lessonPlanId]);

  const handleBrowseFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      setLessonPlanPdf(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Document Picker Error: ', err);
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const handleUpdateLessonPlan = async () => {
    if (!lessonPlanTitle) {
      Alert.alert('Error', 'Lesson plan title is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('lessonPlanTitle', lessonPlanTitle);
      if (lessonPlanPdf && typeof lessonPlanPdf !== 'string') {
        formData.append('lessonPlanPdf', {
          uri: lessonPlanPdf.uri,
          type: lessonPlanPdf.type,
          name: lessonPlanPdf.name,
        });
      }

      const response = await fetch(
        `${baseURL}/LessonPlan/updateLessonPlan?id=${lessonPlanId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      const result = await response.json();
      if (result.status === 'Success') {
        Alert.alert('Success', 'Lesson Plan Updated');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Update Lesson Plan Error: ', error);
      Alert.alert('Error', `Failed to update lesson plan: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Lesson Plan Title"
        value={lessonPlanTitle}
        onChangeText={setLessonPlanTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Lesson Plan PDF"
        value={
          lessonPlanPdf && typeof lessonPlanPdf === 'string'
            ? lessonPlanPdf.split('/').pop()
            : lessonPlanPdf
            ? lessonPlanPdf.name
            : ''
        }
        editable={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleBrowseFile}>
        <Text style={styles.buttonText}>Browse File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleUpdateLessonPlan}>
        <Text style={styles.buttonText}>Update Lesson Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#7d6dc1',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditLessonPlan;
