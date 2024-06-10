import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import baseURL from '../../config';

const CourseScreen = ({ route }) => {
  const { course } = route.params;
  const [activeTab, setActiveTab] = useState('Weekly LP');
  const [weekNo, setWeekNo] = useState('');
  const [lessonPlan, setLessonPlan] = useState(null);
  const [lessonPlans, setLessonPlans] = useState([]);

  useEffect(() => {
    fetchLessonPlans();
  }, [course]);

  const fetchLessonPlans = async () => {
    try {
      const response = await fetch(`${baseURL}/LessonPlan/getAllLessonPlan?courseCode=${course.courseCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === 'Success') {
        setLessonPlans(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Fetch Lesson Plans Error: ', error);
      Alert.alert('Error', 'Failed to fetch lesson plans');
    }
  };

  const handleBrowseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setLessonPlan(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Document Picker Error: ', err);
        throw err;
      }
    }
  };

  const handleAddLessonPlan = async () => {
    if (weekNo && lessonPlan) {
      try {
        const formData = new FormData();
        formData.append('lessonPlanTitle', weekNo);
        formData.append('lessonPlanPdf', {
          uri: lessonPlan.uri,
          type: lessonPlan.type,
          name: lessonPlan.name,
        });
        formData.append('creatorId', '1'); // Adjust accordingly
        formData.append('creatorType', 'teacher'); // Adjust accordingly
        formData.append('courseCode', course.courseCode);

        console.log('FormData:', formData); // Log FormData for debugging

        const response = await fetch(`${baseURL}/LessonPlan/addLessonPlan`, {
          method: 'POST',
          body: formData,
        });

        console.log('Response:', response); // Log response for debugging

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, data: ${errorData}`);
        }

        const result = await response.json();
        console.log('Result:', result); // Log the result for debugging

        if (result.status === 'Success') {
          // Add the new lesson plan to the list
          setLessonPlans([...lessonPlans, { weekNo, lessonPlan }]);
          setWeekNo('');
          setLessonPlan(null);
          Alert.alert('Success', 'Lesson Plan Added');
        } else {
          Alert.alert('Error', result.message);
        }
      } catch (error) {
        console.error('Add Lesson Plan Error: ', error); // Log the error for debugging
        Alert.alert('Error', `Failed to add lesson plan: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Week number and lesson plan PDF are required');
    }
  };

  const handleDeleteLessonPlan = async (lessonPlanId) => {
    try {
      const response = await fetch(`${baseURL}/LessonPlan/removeLessonPlan?id=${lessonPlanId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.status === 'Success') {
        // Remove the lesson plan from the list
        setLessonPlans(lessonPlans.filter(plan => plan.lessonPlanId !== lessonPlanId));
        Alert.alert('Success', 'Lesson Plan Removed');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Delete Lesson Plan Error: ', error);
      Alert.alert('Error', 'Failed to remove lesson plan');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('Books')}
          style={[styles.tabButton, activeTab === 'Books' && styles.activeTab]}
        >
          <Text style={styles.tabText}>Books</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Weekly LP')}
          style={[styles.tabButton, activeTab === 'Weekly LP' && styles.activeTab]}
        >
          <Text style={styles.tabText}>Weekly LP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('References')}
          style={[styles.tabButton, activeTab === 'References' && styles.activeTab]}
        >
          <Text style={styles.tabText}>References</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Books' && (
        <View style={styles.contentContainer}>
          <Text>Books content for {course.courseName} goes here.</Text>
        </View>
      )}

      {activeTab === 'Weekly LP' && (
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            placeholder="Week No"
            value={weekNo}
            onChangeText={setWeekNo}
          />
          <TextInput
            style={styles.input}
            placeholder="Lesson Plan pdf"
            value={lessonPlan ? lessonPlan.name : ''}
            editable={false}
          />
          <TouchableOpacity style={styles.button} onPress={handleBrowseFile}>
            <Text style={styles.buttonText}>Browse File</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddLessonPlan}>
            <Text style={styles.buttonText}>Add Lesson Plan</Text>
          </TouchableOpacity>

          {lessonPlans.map((plan, index) => (
            <View key={index} style={styles.lessonPlanContainer}>
              <Text style={styles.lessonPlanText}>Week {plan.weekNo}</Text>
              <View style={styles.lessonPlanActions}>
                <TouchableOpacity>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteLessonPlan(plan.lessonPlanId)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'References' && (
        <View style={styles.contentContainer}>
          <Text>References content for {course.courseName} goes here.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#7d6dc1',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#7d6dc1',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lessonPlanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  lessonPlanText: {
    fontSize: 16,
    color: '#000',
  },
  lessonPlanActions: {
    flexDirection: 'row',
  },
  editText: {
    marginRight: 10,
    color: '#007BFF',
  },
  deleteText: {
    color: '#FF0000',
  },
});

export default CourseScreen;
