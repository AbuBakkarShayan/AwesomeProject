import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import {Linking} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import baseURL from '../../config';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const CourseScreen = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();
  const route = useRoute();
  const {course, teacherId} = route.params; // Ensure teacherId and course are received from route params
  const [activeTab, setActiveTab] = useState('Weekly LP');
  const [weekNo, setWeekNo] = useState('');
  const [lessonPlan, setLessonPlan] = useState(null);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [books, setBooks] = useState([]);

  // State for reference materials
  const [referenceTitle, setReferenceTitle] = useState('');
  const [referenceUri, setReferenceUri] = useState('');
  const [referenceMaterials, setReferenceMaterials] = useState([]);

  const fetchLessonPlans = async () => {
    try {
      const response = await fetch(
        `${baseURL}/LessonPlan/getAllLessonPlan?courseCode=${course.courseCode}`,
      );
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

  const fetchReferenceMaterials = async () => {
    try {
      const response = await fetch(
        `${baseURL}/Reference/getReferenceMaterial?courseCode=${course.courseCode}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Reference Materials API Response:', result); // Debugging log
      if (result.status === 'Success') {
        setReferenceMaterials(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Fetch Reference Materials Error: ', error);
      Alert.alert('Error', 'Failed to fetch reference materials');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${baseURL}/CourseBookAssign/getCourseAssignedBook?courseCode=${course.courseCode}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Books API Response:', result); // Debugging log
      if (result.status === 'Success') {
        setBooks(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Fetch Books Error: ', error);
      Alert.alert('Error', 'Failed to fetch books');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLessonPlans();
      fetchReferenceMaterials();
    }, [course.courseCode]),
  );

  const handleBrowseFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      setLessonPlan(res);
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

  const handleAddLessonPlan = async () => {
    if (!weekNo || !lessonPlan) {
      Alert.alert('Error', 'Week number and lesson plan PDF are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('lessonPlanTitle', weekNo);
      formData.append('lessonPlanPdf', {
        uri: lessonPlan.uri,
        type: lessonPlan.type,
        name: lessonPlan.name,
      });

      // Ensure teacherId is defined and convert it to string
      if (!teacherId) {
        throw new Error('Teacher ID is undefined');
      }
      formData.append('creatorId', String(teacherId));
      formData.append('creatorType', 'teacher');
      formData.append('courseCode', course.courseCode);

      console.log('FormData before sending:', formData); // Debugging log

      const response = await fetch(`${baseURL}/LessonPlan/addLessonPlan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, data: ${errorData}`,
        );
      }

      const result = await response.json();
      console.log('Add Lesson Plan Result:', result); // Debugging log
      if (result.status === 'Success') {
        fetchLessonPlans(); // Refresh lesson plans list
        setWeekNo('');
        setLessonPlan(null);
        Alert.alert('Success', 'Lesson Plan Added');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Add Lesson Plan Error: ', error);
      Alert.alert('Error', `Failed to add lesson plan: ${error.message}`);
    }
  };

  const handleAddReferenceMaterial = async () => {
    if (!referenceTitle || !referenceUri) {
      Alert.alert('Error', 'Title and URI are required for reference material');
      return;
    }

    try {
      const payload = {
        referenceTitle,
        referenceUri,
        courseCode: course.courseCode,
        uploaderId: teacherId,
        uploaderType: 'teacher',
      };

      const response = await fetch(
        `${baseURL}/Reference/addReferenceMaterial`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, data: ${errorData}`,
        );
      }

      const result = await response.json();
      console.log('Add Reference Material Result:', result); // Debugging log
      if (result.status === 'Success') {
        fetchReferenceMaterials(); // Refresh reference materials list
        setReferenceTitle('');
        setReferenceUri('');
        Alert.alert('Success', 'Reference Material Added');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Add Reference Material Error: ', error);
      Alert.alert(
        'Error',
        `Failed to add reference material: ${error.message}`,
      );
    }
  };

  const handleDeleteReferenceMaterial = async referenceId => {
    try {
      const response = await fetch(
        `${baseURL}/Reference/removeReferenceMaterial?referenceId=${referenceId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();
      console.log('Delete Reference Material Result:', result); // Debugging log
      if (result.status === 'Success') {
        fetchReferenceMaterials(); // Refresh reference materials list
        Alert.alert('Success', 'Reference Material Removed');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Delete Reference Material Error: ', error);
      Alert.alert('Error', 'Failed to remove reference material');
    }
  };

  const handleEditLessonPlan = lessonPlanId => {
    navigation.navigate('EditLessonPlan', {lessonPlanId});
  };

  const handleDeleteLessonPlan = async lessonPlanId => {
    try {
      const response = await fetch(
        `${baseURL}/lessonplan/removeLessonPlan/${lessonPlanId}`,
        {
          method: 'DELETE',
        },
      );

      const result = await response.json();

      if (result.status === 'Success') {
        alert('Lesson Plan Removed');
        // Optionally refresh your lesson plans list or perform other actions
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  };

  const handleEditReferenceMaterial = referenceId => {
    navigation.navigate('EditReferenceMaterial', {referenceId});
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('Books');
            fetchBooks();
          }}
          style={[styles.tabButton, activeTab === 'Books' && styles.activeTab]}>
          <Text style={styles.tabText}>Books</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Weekly LP')}
          style={[
            styles.tabButton,
            activeTab === 'Weekly LP' && styles.activeTab,
          ]}>
          <Text style={styles.tabText}>Weekly LP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('References')}
          style={[
            styles.tabButton,
            activeTab === 'References' && styles.activeTab,
          ]}>
          <Text style={styles.tabText}>References</Text>
        </TouchableOpacity>
      </View>

      {/* {activeTab === 'Books' && (
        <View style={styles.contentContainer}>
          <Text>Books content for {course.courseName} goes here.</Text>
        </View>
      )} */}
      {activeTab === 'Books' && (
        <View style={styles.contentContainer}>
          <FlatList
            data={books}
            keyExtractor={item => item.bookId.toString()}
            renderItem={({item}) => (
              <View style={styles.bookItem}>
                <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                <Text style={styles.bookAuthor}>
                  Author: {item.bookAuthorName}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      {activeTab === 'Weekly LP' && (
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            placeholder="Week No"
            placeholderTextColor={'#7E7E7E'}
            value={weekNo}
            onChangeText={setWeekNo}
          />
          <TextInput
            style={styles.input}
            placeholder="Lesson Plan pdf"
            placeholderTextColor={'#7E7E7E'}
            value={lessonPlan ? lessonPlan.name : ''}
            editable={false}
          />
          <TouchableOpacity style={styles.button} onPress={handleBrowseFile}>
            <Text style={styles.buttonText}>Browse File</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddLessonPlan}>
            <Text style={styles.buttonText}>Add Lesson Plan</Text>
          </TouchableOpacity>

          <FlatList
            data={lessonPlans}
            keyExtractor={item => item.lessonPlanId.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PDFReaderScreen', {
                    uri: item.lessonPlanPdfUri,
                  })
                }>
                <View style={styles.lessonPlanContainer}>
                  <Text style={styles.lessonPlanText}>
                    Week {item.lessonPlanTitle}
                  </Text>
                  <View style={styles.lessonPlanActions}>
                    <TouchableOpacity
                      onPress={() => handleEditLessonPlan(item.lessonPlanId)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteLessonPlan(item.lessonPlanId)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No lesson plans available.</Text>}
          />
        </View>
      )}

      {activeTab === 'References' && (
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.input}
            placeholder="Reference Title"
            placeholderTextColor={'#7E7E7E'}
            value={referenceTitle}
            onChangeText={setReferenceTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Reference URI"
            placeholderTextColor={'#7E7E7E'}
            value={referenceUri}
            onChangeText={setReferenceUri}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddReferenceMaterial}>
            <Text style={styles.buttonText}>Add Reference Material</Text>
          </TouchableOpacity>

          <FlatList
            data={referenceMaterials}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.referenceUri)}>
                <View style={styles.lessonPlanContainer}>
                  <Text style={styles.lessonPlanText}>
                    {item.referenceTitle}
                  </Text>
                  <View style={styles.lessonPlanActions}>
                    <TouchableOpacity
                      onPress={() => handleEditReferenceMaterial(item.id)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteReferenceMaterial(item.id)}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No reference materials available.</Text>}
          />
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
    color: 'white',
  },
  tabText: {
    color: 'black',
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
    color: 'black',
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
    color: 'black',
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
  fileName: {
    marginBottom: 16,
  },
  bookItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
});

export default CourseScreen;
// import React, {useState, useCallback} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   FlatList,
// } from 'react-native';
// import {Linking} from 'react-native';
// import {
//   useFocusEffect,
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';
// import DocumentPicker from 'react-native-document-picker';
// import baseURL from '../../config';

// const CourseScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const {course, teacherId} = route.params; // Ensure teacherId and course are received from route params
//   const [activeTab, setActiveTab] = useState('Weekly LP');
//   const [weekNo, setWeekNo] = useState('');
//   const [lessonPlan, setLessonPlan] = useState(null);
//   const [lessonPlans, setLessonPlans] = useState([]);
//   const [books, setBooks] = useState([]);

//   // State for reference materials
//   const [referenceTitle, setReferenceTitle] = useState('');
//   const [referenceUri, setReferenceUri] = useState('');
//   const [referenceMaterials, setReferenceMaterials] = useState([]);

//   const fetchLessonPlans = async () => {
//     try {
//       const response = await fetch(
//         `${baseURL}/LessonPlan/getAllLessonPlan?courseCode=${course.courseCode}`,
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const result = await response.json();
//       console.log('API Response:', result); // Debugging log
//       if (result.status === 'Success') {
//         setLessonPlans(result.data);
//       } else {
//         Alert.alert('Error', result.message);
//       }
//     } catch (error) {
//       console.error('Fetch Lesson Plans Error: ', error);
//       Alert.alert('Error', 'Failed to fetch lesson plans');
//     }
//   };

//   const fetchReferenceMaterials = async () => {
//     try {
//       const response = await fetch(
//         `${baseURL}/Reference/getReferenceMaterial?courseCode=${course.courseCode}`,
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const result = await response.json();
//       console.log('Reference Materials API Response:', result); // Debugging log
//       if (result.status === 'Success') {
//         setReferenceMaterials(result.data);
//       } else {
//         Alert.alert('Error', result.message);
//       }
//     } catch (error) {
//       console.error('Fetch Reference Materials Error: ', error);
//       Alert.alert('Error', 'Failed to fetch reference materials');
//     }
//   };

//   const fetchBooks = async () => {
//     try {
//       const response = await fetch(
//         `${baseURL}/Course/getCourseAssignedBook?courseCode=${course.courseCode}`,
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const result = await response.json();
//       console.log('Books API Response:', result); // Debugging log
//       if (result.status === 'Success') {
//         setBooks(result.data);
//       } else {
//         Alert.alert('Error', result.message);
//       }
//     } catch (error) {
//       console.error('Fetch Books Error: ', error);
//       Alert.alert('Error', 'Failed to fetch books');
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchLessonPlans();
//       fetchReferenceMaterials();
//     }, [course.courseCode]),
//   );

//   const handleBrowseFile = async () => {
//     try {
//       const res = await DocumentPicker.pickSingle({
//         type: [DocumentPicker.types.pdf],
//       });
//       setLessonPlan(res);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User cancelled the picker');
//       } else {
//         console.error('Document Picker Error: ', err);
//         Alert.alert('Unknown Error: ' + JSON.stringify(err));
//         throw err;
//       }
//     }
//   };

//   const handleAddLessonPlan = async () => {
//     if (!weekNo || !lessonPlan) {
//       Alert.alert('Error', 'Week number and lesson plan PDF are required');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('lessonPlanTitle', weekNo);
//       formData.append('lessonPlanPdf', {
//         uri: lessonPlan.uri,
//         type: lessonPlan.type,
//         name: lessonPlan.name,
//       });

//       // Ensure teacherId is defined and convert it to string
//       if (!teacherId) {
//         throw new Error('Teacher ID is undefined');
//       }
//       formData.append('creatorId', String(teacherId));
//       formData.append('creatorType', 'teacher');
//       formData.append('courseCode', course.courseCode);

//       console.log('FormData before sending:', formData); // Debugging log

//       const response = await fetch(`${baseURL}/LessonPlan/addLessonPlan`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.text();
//         throw new Error(
//           `HTTP error! status: ${response.status}, data: ${errorData}`,
//         );
//       }

//       const result = await response.json();
//       console.log('Add Lesson Plan Result:', result); // Debugging log
//       if (result.status === 'Success') {
//         fetchLessonPlans(); // Refresh lesson plans list
//         setWeekNo('');
//         setLessonPlan(null);
//         Alert.alert('Success', 'Lesson Plan Added');
//       } else {
//         Alert.alert('Error', result.message);
//       }
//     } catch (error) {
//       console.error('Add Lesson Plan Error: ', error);
//       Alert.alert('Error', `Failed to add lesson plan: ${error.message}`);
//     }
//   };

//   const handleAddReferenceMaterial = async () => {
//     if (!referenceTitle || !referenceUri) {
//       Alert.alert('Error', 'Title and URI are required for reference material');
//       return;
//     }

//     try {
//       const payload = {
//         referenceTitle,
//         referenceUri,
//         courseCode: course.courseCode,
//         uploaderId: teacherId,
//         uploaderType: 'teacher',
//       };

//       const response = await fetch(
//         `${baseURL}/Reference/addReferenceMaterial`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.text();
//         throw new Error(
//           `HTTP error! status: ${response.status}, data: ${errorData}`,
//         );
//       }

//       const result = await response.json();
//       console.log('Add Reference Material Result:', result); // Debugging log
//       if (result.status === 'Success') {
//         fetchReferenceMaterials(); // Refresh reference materials list
//         setReferenceTitle('');
//         setReferenceUri('');
//         Alert.alert('Success', 'Reference Material Added');
//       } else {
//         Alert.alert('Error', result.message);
//       }
//     } catch (error) {
//       console.error('Add Reference Material Error: ', error);
//       Alert.alert(
//         'Error',
//         `Failed to add reference material: ${error.message}`,
//       );
//     }
//   };

//   const handleDeleteReferenceMaterial = async referenceId => {
//     try {
//       const response = await fetch(
//         `${baseURL}/Reference/removeReferenceMaterial?referenceId=${referenceId}`,
//         {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       const result = await response.json();
//       console.log('Delete Reference Material Result:', result); // Debugging log
//       if (result.status === 'Success') {
//         fetchReferenceMaterials(); // Refresh reference materials list
//         Alert.alert('Success', 'Reference Material Removed');
//       } else {
//         Alert.alert('Error', result.message);
//       }
//     } catch (error) {
//       console.error('Delete Reference Material Error: ', error);
//       Alert.alert('Error', 'Failed to remove reference material');
//     }
//   };

//   const handleEditLessonPlan = lessonPlanId => {
//     navigation.navigate('EditLessonPlan', {lessonPlanId});
//   };

//   const handleDeleteLessonPlan = async lessonPlanId => {
//     try {
//       const response = await fetch(
//         `${baseURL}/lessonplan/removeLessonPlan/${lessonPlanId}`,
//         {
//           method: 'DELETE',
//         },
//       );

//       const result = await response.json();

//       if (result.status === 'Success') {
//         alert('Lesson Plan Removed');
//         // Optionally refresh your lesson plans list or perform other actions
//       } else {
//         alert(result.message);
//       }
//     } catch (error) {
//       alert('An error occurred: ' + error.message);
//     }
//   };

//   const handleEditReferenceMaterial = referenceId => {
//     navigation.navigate('EditReferenceMaterial', {referenceId});
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           onPress={() => {
//             setActiveTab('Weekly LP');
//             fetchLessonPlans(); // Fetch lesson plans when tab is clicked
//           }}
//           style={[
//             styles.tabButton,
//             activeTab === 'Weekly LP' && styles.activeTab,
//           ]}>
//           <Text
//             style={[
//               styles.tabButtonText,
//               activeTab === 'Weekly LP' && styles.activeTabText,
//             ]}>
//             Weekly LP
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             setActiveTab('Books');
//             fetchBooks(); // Fetch books when tab is clicked
//           }}
//           style={[
//             styles.tabButton,
//             activeTab === 'Books' && styles.activeTab,
//           ]}>
//           <Text
//             style={[
//               styles.tabButtonText,
//               activeTab === 'Books' && styles.activeTabText,
//             ]}>
//             Books
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             setActiveTab('Reference');
//             fetchReferenceMaterials(); // Fetch reference materials when tab is clicked
//           }}
//           style={[
//             styles.tabButton,
//             activeTab === 'Reference' && styles.activeTab,
//           ]}>
//           <Text
//             style={[
//               styles.tabButtonText,
//               activeTab === 'Reference' && styles.activeTabText,
//             ]}>
//             Reference
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {activeTab === 'Weekly LP' && (
//         <View style={styles.contentContainer}>
//           <Text style={styles.label}>Week Number:</Text>
//           <TextInput
//             style={styles.input}
//             value={weekNo}
//             onChangeText={setWeekNo}
//             keyboardType="numeric"
//           />
//           <TouchableOpacity style={styles.button} onPress={handleBrowseFile}>
//             <Text style={styles.buttonText}>Browse File</Text>
//           </TouchableOpacity>
//           {lessonPlan && (
//             <Text style={styles.fileName}>Selected File: {lessonPlan.name}</Text>
//           )}
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={handleAddLessonPlan}>
//             <Text style={styles.buttonText}>Add Lesson Plan</Text>
//           </TouchableOpacity>

//           <FlatList
//             data={lessonPlans}
//             keyExtractor={item => item.lessonPlanId.toString()}
//             renderItem={({item}) => (
//               <View style={styles.lessonPlanItem}>
//                 <Text style={styles.lessonPlanTitle}>{item.title}</Text>
//                 <TouchableOpacity
//                   style={styles.editButton}
//                   onPress={() => handleEditLessonPlan(item.lessonPlanId)}>
//                   <Text style={styles.buttonText}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.deleteButton}
//                   onPress={() => handleDeleteLessonPlan(item.lessonPlanId)}>
//                   <Text style={styles.buttonText}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           />
//         </View>
//       )}

//       {activeTab === 'Books' && (
//         <View style={styles.contentContainer}>
//           <FlatList
//             data={books}
//             keyExtractor={item => item.bookId.toString()}
//             renderItem={({item}) => (
//               <View style={styles.bookItem}>
//                 <Text style={styles.bookTitle}>{item.bookTitle}</Text>
//                 <Text style={styles.bookAuthor}>Author: {item.bookAuthorName}</Text>
//               </View>
//             )}
//           />
//         </View>
//       )}

//       {activeTab === 'Reference' && (
//         <View style={styles.contentContainer}>
//           <Text style={styles.label}>Title:</Text>
//           <TextInput
//             style={styles.input}
//             value={referenceTitle}
//             onChangeText={setReferenceTitle}
//           />
//           <Text style={styles.label}>URI:</Text>
//           <TextInput
//             style={styles.input}
//             value={referenceUri}
//             onChangeText={setReferenceUri}
//           />
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={handleAddReferenceMaterial}>
//             <Text style={styles.buttonText}>Add Reference Material</Text>
//           </TouchableOpacity>

//           <FlatList
//             data={referenceMaterials}
//             keyExtractor={item => item.referenceId.toString()}
//             renderItem={({item}) => (
//               <View style={styles.referenceItem}>
//                 <Text style={styles.referenceTitle}>{item.referenceTitle}</Text>
//                 <Text
//                   style={styles.referenceUri}
//                   onPress={() => Linking.openURL(item.referenceUri)}>
//                   {item.referenceUri}
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.editButton}
//                   onPress={() => handleEditReferenceMaterial(item.referenceId)}>
//                   <Text style={styles.buttonText}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.deleteButton}
//                   onPress={() => handleDeleteReferenceMaterial(item.referenceId)}>
//                   <Text style={styles.buttonText}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   tabButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: '#ccc',
//   },
//   activeTab: {
//     backgroundColor: '#007BFF',
//   },
//   tabButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   contentContainer: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 8,
//     marginBottom: 16,
//   },
//   button: {
//     backgroundColor: '#007BFF',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   addButton: {
//     backgroundColor: '#28a745',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   lessonPlanItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   lessonPlanTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   editButton: {
//     backgroundColor: '#ffc107',
//     padding: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   deleteButton: {
//     backgroundColor: '#dc3545',
//     padding: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   fileName: {
//     marginBottom: 16,
//   },
//   bookItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   bookTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   bookAuthor: {
//     fontSize: 14,
//     color: '#666',
//   },
//   referenceItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   referenceTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   referenceUri: {
//     color: '#007BFF',
//     textDecorationLine: 'underline',
//     marginTop: 4,
//   },
// });

// export default CourseScreen;
