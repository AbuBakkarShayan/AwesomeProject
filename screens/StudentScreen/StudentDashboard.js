// import React from 'react';
// import { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

// const StudentDashboard = () => {
//   const [studentId, setStudentId] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchStudentId = async () => {
//       try {
//         const id = await AsyncStorage.getItem('studentId');
//         if (id !== null) {
//           setStudentId(id);
//         } else {
//           console.log('No studentId found');
//         }
//       } catch (error) {
//         console.log('Error fetching studentId:', error);
//       }
//     };

//     fetchStudentId();
//   }, []);

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => <LogoutButton />,
//     });
//   }, [navigation]);

//   const list = [
//     { index: '1', name: 'Courses', screen: 'CoursesScreen' },
//     { index: '2', name: 'Library Books', screen: 'LibraryScreen' },
//     { index: '3', name: 'My Books List', screen: 'MyCourseItemsScreen' },
//     { index: '4', name: 'Profile', screen: 'StudentProfileScreen' },
//   ];

//   const navigateToScreen = (screenName) => {
//     navigation.navigate(screenName, { studentId });
//   };

//   return (
//     <View>
//       <View style={styles.container}>
//         <Text style={styles.title}>Student Dashboard</Text>
//         {studentId ? (
//           <Text style={styles.idText}>Student ID: {studentId}</Text>
//         ) : (
//           <Text style={styles.idText}>Loading...</Text>
//         )}
//       </View>
//       <FlatList
//         style={styles.listStyle}
//         keyExtractor={(item) => item.index}
//         data={list}
//         renderItem={({ item }) => (
//           <View style={styles.listItem}>
//             <TouchableOpacity onPress={() => navigateToScreen(item.screen)}>
//               <Text style={styles.textStyle}>{item.name}</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     color: "#7E7E7E"
//   },
//   idText: {
//     fontSize: 18,
//     color: 'black'
//   },
//   listStyle: {
//     marginTop: 20,
//     padding: 8,
//   },
//   listItem: {
//     backgroundColor: '#5B5D8B',
//     margin: 5,
//     padding: 20,
//     borderRadius: 10,
//   },
//   textStyle: {
//     fontSize: 20,
//     color: 'white',
//     textAlign: 'center',
//   },
// });

// export default StudentDashboard;
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import baseURL from '../../config';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const StudentDashboard = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const route = useRoute();
  const navigation = useNavigation();

  const {studentId = null, isFirstLogin = 'False'} = route.params || {};
  const [regNo, setRegNo] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const storedRegNo = await AsyncStorage.getItem('regNo');
      const storedRole = await AsyncStorage.getItem('userRole'); // Changed to 'userRole'
      setRegNo(storedRegNo);
      setRole(storedRole);
      if (isFirstLogin === 'True') {
        showUpdatePasswordDialog();
      }
    };

    fetchData();
  }, [isFirstLogin]);

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'userRole',
      'username',
      'regNo',
      'phoneNo',
      'password',
    ]);
    navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen1'}],
    });
  };

  const updatePassword = async password => {
    const url = `${baseURL}/user/updatepassword`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: regNo,
          password: password,
          isFirstLogin: 'False',
        }),
      });
      const responseBody = await response.json();
      if (response.status === 200 && responseBody.status === 'Success') {
        logout();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Server Down');
    }
  };

  const showUpdatePasswordDialog = () => {
    Alert.prompt(
      'Update Password',
      'Please update your password.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: password => updatePassword(password),
        },
      ],
      'plain-text',
    );
  };

  const dashboardData = [
    {
      name: 'Course',
      icon: 'document-outline',
      function: () => navigation.navigate('CoursesScreen', {studentId, role}),
    },
    {
      name: 'Library Books',
      icon: 'library-outline',
      function: () => navigation.navigate('LibraryScreen', {studentId, role}),
    },
    {
      name: 'My Item',
      icon: 'save-outline',
      function: () =>
        navigation.navigate('MyCourseItemsScreen', {studentId, role}),
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      function: () =>
        navigation.navigate('StudentProfileScreen', {studentId, role}),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard {studentId}</Text>
      <Text style={styles.roleText}>Role: {role}</Text>
      {dashboardData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tile}
          onPress={item.function}>
          <Icon name={item.icon} size={40} style={styles.icon} />
          <Text style={styles.tileText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  roleText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
  },
  tile: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#5B5D8B',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 20,
    color: 'white',
  },
  tileText: {
    fontSize: 18,
    color: 'white',
  },
});

export default StudentDashboard;
