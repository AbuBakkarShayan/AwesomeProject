// import { StyleSheet, Text, View , FlatList, TouchableOpacity,} from 'react-native'
// import React from 'react'
// import LogoutButton from '../AdminScreen/customcomponent/logoutComponent'
// import { useNavigation } from '@react-navigation/core';

// export default function Courses({navigation}) {

//   //logout icon in header
//   React.useLayoutEffect(()=>{
//     navigation.setOptions({
//       headerRight:()=><LogoutButton />,
//     });
//   }, [navigation]);
//   const navigate= useNavigation();
//   const list = [
//     {
//       index: '1',
//       name: 'Artificial Intelligence',
//       screen: 'CourseMaterial',
//     },
//     {
//       index: '2',
//       name: 'Data Structure',
//       screen: 'CourseMaterial', // Define the corresponding screen name
    
//     },
//     {
//       index: '3',
//       name: 'Discrete Mathemathics',
//       screen: 'CourseMaterial',
//     },
//     {
//       index: '4',
//       name: 'Digital Logic Design',
//       screen:'CourseMaterial'  
//     },
//   ];

//   const navigateToScreen = (screenName)=>{
//     navigation.navigate(screenName);
//   }

//   return (
//     <View>
//       <FlatList
//         style={styles.listStyle}
//         keyExtractor={(item) => item.index}
//         data={list}
//         renderItem={({ item }) => (
//           <View style={styles.listItem}>
//             <TouchableOpacity onPress={()=>navigateToScreen(item.screen)}>
//             <Text style={styles.textStyle}>{item.name}</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   listStyle: {
//   marginTop: 20,
//   padding:8
// },
// listItem: {
//   backgroundColor: '#5B5D8B',
//   margin: 5,
//   padding: 20,
//   borderRadius: 10,
// },
// textStyle: {
//   fontSize: 20,
//   color: 'white',
//   textAlign: 'center',
// },
// })
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import baseURL from '../../config';

// const Courses = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { studentId } = route.params;

//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const url = `${baseURL}/enrollment/getEnrollment?studentId=${studentId}&year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}`;
//       try {
//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (response.ok) {
//           const responseBody = await response.json();
//           if (responseBody.status === 'Success') {
//             setCourses(responseBody.data);
//           } else {
//             setMessage(responseBody.message);
//           }
//         } else {
//           setMessage(`Error: ${response.status}`);
//         }
//       } catch (error) {
//         console.error(error);
//         setMessage('Server Down');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [studentId]);

//   const StudentTeacherCourseTile = ({ course, onPress }) => {
//     return (
//       <TouchableOpacity style={styles.tile} onPress={() => onPress(course.courseCode,course.courseName)}>
//         <View>
//           <Text style={styles.courseTitle}>{course.courseName}</Text>
//           <Text style={styles.courseCode}>{course.courseCode}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : courses.length === 0 ? (
//         <View style={styles.messageContainer}>
//           <Text style={styles.message}>{message}</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={courses}
//           keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
//           renderItem={({ item }) => (
//             <StudentTeacherCourseTile
//               course={item}
//               onPress={(courseCode) =>
//                 navigation.navigate('CourseMaterial', {
//                   studentId: studentId,
//                   courseCode: courseCode,
//                 })
//               }
//             />
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   appBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#5B5D8B',
//     padding: 10,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 20,
//     marginLeft: 10,
//   },
//   messageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   message: {
//     fontSize: 18,
//     color: '#555',
//   },
//   tile: {
//     padding: 20,
//     marginVertical: 10,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     elevation: 3,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   courseTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   courseCode: {
//     fontSize: 16,
//     color: '#555',
//   },
// });

// export default Courses;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../config';

const TeacherCoursesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null); // State to store teacherId

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const id = await AsyncStorage.getItem('studentId');
        if (id !== null) {
          setStudentId(id);
        } else {
          console.log('No studentId found');
          throw new Error('Student ID is missing');
        }
      } catch (error) {
        console.log('Error fetching studentId:', error);
        setError(error.message || 'Failed to fetch studentId');
      }
    };

    fetchStudentId();
  }, []);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        // Fetch teacherId from route params or AsyncStorage
        let fetchedStudentId = route.params?.studentId;

        if (!fetchedStudentId) {
          fetchedStudentId = studentId; // Use teacherId from state if not provided in route params
        }

        if (!fetchedStudentId) {
          throw new Error('Teacher ID is missing');
        }

        console.log(`Fetching courses for studentId: ${fetchedStudentId}`);

        // API call to fetch courses
        const response = await fetch(`${baseURL}/enrollment/getEnrollment?studentId=${studentId}&year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(`API Response Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log('API Response Data:', data);

          if (data.status === 'Success') {
            setCourses(data.data); // Ensure this matches the structure of your response
            console.log('Courses set to state:', data.data);
          } else {
            console.log('API Error Message:', data.message);
            setError(data.message || 'Failed to fetch courses');
          }
        } else {
          const errorText = await response.text();
          console.log('Response not OK:', errorText);
          setError(`Failed to fetch courses: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setError(error.message || 'An error occurred while fetching courses');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentCourses();
    }
  }, [route.params, studentId]);

  if (loading) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color="#7d6dc1" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.courseCode.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseContainer}
            onPress={() => navigation.navigate('CourseMaterial', { course: item, studentId })} // Pass studentId to CourseMaterialScreen
          >
            <Text style={styles.courseName}>{item.courseName}</Text>
            <Text style={styles.creditHour}>Credit Hours: {item.creditHours}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
  },
  creditHour: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7E7E7E',
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default TeacherCoursesScreen;
