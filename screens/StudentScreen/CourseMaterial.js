// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ActivityIndicator ,TouchableOpacity} from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';
// import baseURL from '../../config';

// const CourseMaterial = () => {
//   const [departments, setDepartments] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [loadingDepartments, setLoadingDepartments] = useState(true);
//   const [loadingTeachers, setLoadingTeachers] = useState(false);

//   // Fetch departments on component mount
//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   // Fetch departments from API
//   const fetchDepartments = () => {
//     fetch(`${baseURL}/department/allDepartment`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (data && Array.isArray(data.data)) {
//           const formattedData = data.data.map(department => ({
//             label: department.departmentName,
//             value: department.departmentId,
//           }));
//           setDepartments(formattedData);
//         } else {
//           console.error('Error: Data is not an array', data);
//         }
//         setLoadingDepartments(false);
//       })
//       .catch(error => {
//         console.error('Error fetching departments:', error);
//         setLoadingDepartments(false);
//       });
//   };

//   // Fetch teachers for selected department
//   useEffect(() => {
//     if (selectedDepartment) {
//       fetchTeachers(selectedDepartment);
//     }
//   }, [selectedDepartment]);

//   // Fetch teachers from API for the selected department
//   const fetchTeachers = (departmentId) => {
//     setLoadingTeachers(true);
//     fetch(`${baseURL}/teacher/getAllTeacher?departmentId=${departmentId}`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (data && Array.isArray(data.data)) {
//           const formattedData = data.data.map(teacher => ({
//             label: teacher.teacherName,
//             value: teacher.teacherId,
//           }));
//           setTeachers(formattedData);
//         } else {
//           console.error('Error: Data is not an array', data);
//         }
//         setLoadingTeachers(false);
//       })
//       .catch(error => {
//         console.error('Error fetching teachers:', error);
//         setLoadingTeachers(false);
//       });
//   };


  

//   return (
//     <View>
//       {loadingDepartments ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <Dropdown
//           style={styles.dropdown}
//           data={departments}
//           labelField="label"
//           valueField="value"
//           itemTextStyle={styles.itemText}
//           selectedTextStyle={{color:'black'}}
//           placeholder="Select department"
//           placeholderStyle={styles.placeholder}
//           value={selectedDepartment}
//           onChange={item => {
//             setSelectedDepartment(item.value);
//           }}
//         />
//       )}

//       {loadingTeachers ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <Dropdown
//           style={styles.dropdown}
//           data={teachers}
//           labelField="label"
//           valueField="value"
//           selectedTextStyle={{color:'black'}}
//           itemTextStyle={styles.itemText}
//           placeholder="Select teacher"
//           placeholderStyle={styles.placeholder}
//           value={null}
//           onChange={item => {
//             // Handle teacher selection if needed
//           }}
//         />

        
//       )}
//       <TouchableOpacity style={styles.button} onPress={assignCourseToTeacher}>
//         <Text style={styles.buttonText}>Assign</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default CourseMaterial;

// const styles = StyleSheet.create({
//   dropdown: {
//     margin: 16,
//     height: 50,
//     borderBottomColor: 'gray',
//     borderBottomWidth: 0.5,
//     color:"black"
//   },
//   placeholder:{
//     color:'black'
//   },
//   itemText:{
//     color:'black'
//   }
// });
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
//import DocumentPicker from 'react-native-document-picker';
import baseURL from '../../config';

const CourseMaterial = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { course, studentId } = route.params; // Ensure teacherId and course are received from route params
  const [activeTab, setActiveTab] = useState('Weekly LP');
  const [weekNo, setWeekNo] = useState('');
  const [lessonPlan, setLessonPlan] = useState(null);
  const [lessonPlans, setLessonPlans] = useState([]);

  const fetchLessonPlans = async () => {
    try {
      const response = await fetch(`${baseURL}/LessonPlan/getMyLessonPlan?studentId=${studentId},courseCode=${course.courseCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('API Response:', result); // Debugging log
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

  useFocusEffect(
    useCallback(() => {
      fetchLessonPlans();
    }, [])
  );

  // const handleBrowseFile = async () => {
  //   try {
  //     const res = await DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.pdf],
  //     });
  //     setLessonPlan(res);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User cancelled the picker');
  //     } else {
  //       console.error('Document Picker Error: ', err);
  //       Alert.alert('Unknown Error: ' + JSON.stringify(err));
  //       throw err;
  //     }
  //   }
  // };

  // const handleAddLessonPlan = async () => {
  //   if (!weekNo || !lessonPlan) {
  //     Alert.alert('Error', 'Week number and lesson plan PDF are required');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append('lessonPlanTitle', weekNo);
  //     formData.append('lessonPlanPdf', {
  //       uri: lessonPlan.uri,
  //       type: lessonPlan.type,
  //       name: lessonPlan.name,
  //     });

  //     // Ensure teacherId is defined and convert it to string
  //     if (!teacherId) {
  //       throw new Error('Teacher ID is undefined');
  //     }
  //     formData.append('creatorId', String(teacherId));
  //     formData.append('creatorType', 'teacher');
  //     formData.append('courseCode', course.courseCode);

  //     console.log('FormData before sending:', formData); // Debugging log

  //     const response = await fetch(`${baseURL}/LessonPlan/addLessonPlan`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.text();
  //       throw new Error(`HTTP error! status: ${response.status}, data: ${errorData}`);
  //     }

  //     const result = await response.json();
  //     console.log('Add Lesson Plan Result:', result); // Debugging log
  //     if (result.status === 'Success') {
  //       fetchLessonPlans(); // Refresh lesson plans list
  //       setWeekNo('');
  //       setLessonPlan(null);
  //       Alert.alert('Success', 'Lesson Plan Added');
  //     } else {
  //       Alert.alert('Error', result.message);
  //     }
  //   } catch (error) {
  //     console.error('Add Lesson Plan Error: ', error);
  //     Alert.alert('Error', `Failed to add lesson plan: ${error.message}`);
  //   }
  // };

  // const handleDeleteLessonPlan = async (lessonPlanId) => {
  //   try {
  //     const response = await fetch(`${baseURL}/LessonPlan/removeLessonPlan?id=${lessonPlanId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const result = await response.json();
  //     console.log('Delete Lesson Plan Result:', result); // Debugging log
  //     if (result.status === 'Success') {
  //       fetchLessonPlans(); // Refresh lesson plans list
  //       Alert.alert('Success', 'Lesson Plan Removed');
  //     } else {
  //       Alert.alert('Error', result.message);
  //     }
  //   } catch (error) {
  //     console.error('Delete Lesson Plan Error: ', error);
  //     Alert.alert('Error', 'Failed to remove lesson plan');
  //   }
  // };

  // const handleEditLessonPlan = (lessonPlanId) => {
  //   navigation.navigate('EditLessonPlan', { lessonPlanId });
  // };

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
          {/* <TextInput
            style={styles.input}
            placeholder="Week No"
            value={weekNo}
            onChangeText={setWeekNo}
          /> */}
          {/* <TextInput
            style={styles.input}
            placeholder="Lesson Plan pdf"
            value={lessonPlan ? lessonPlan.name : ''}
            editable={false}
          /> */}
          {/* <TouchableOpacity style={styles.button} onPress={handleBrowseFile}>
            <Text style={styles.buttonText}>Browse File</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddLessonPlan}>
            <Text style={styles.buttonText}>Add Lesson Plan</Text>
          </TouchableOpacity> */}

          <FlatList
            data={lessonPlans}
            keyExtractor={(item) => item.lessonPlanId.toString()}
            renderItem={({ item }) => (
              <View style={styles.lessonPlanContainer}>
                <Text style={styles.lessonPlanText}>Week {item.lessonPlanTitle}</Text>
                <View style={styles.lessonPlanActions}>
                  {/* <TouchableOpacity onPress={() => handleEditLessonPlan(item.lessonPlanId)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteLessonPlan(item.lessonPlanId)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            )}
            ListEmptyComponent={<Text>No lesson plans available.</Text>}
          />
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
    backgroundColor: '#fff',
    marginHorizontal: 4,
    
  },
  activeTab: {
    backgroundColor: '#5B5D8B',
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 5,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    color:'black'
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lessonPlanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  lessonPlanText: {
    fontSize: 16,
    color:'black',
  },
  lessonPlanActions: {
    flexDirection: 'row',
  },
  editText: {
    color: '#5B5D8B',
    marginRight: 10,
  },
  deleteText: {
    color: '#ff0000',
  },
});

export default CourseMaterial;
