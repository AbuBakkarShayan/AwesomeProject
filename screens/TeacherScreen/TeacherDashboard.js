// import React from 'react';
// import { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

// const TeacherDashboard = () => {
//   const [teacherId, setTeacherId] = useState(null);
//   const [role, setRole]= useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchTeacherId = async () => {
//       try {
//         const id = await AsyncStorage.getItem('teacherId');
//         const storedRole = await AsyncStorage.getItem('userRole');
//         if (id !== null) {
//           setTeacherId(id);
//         }
//         else if (role!==null){
//           setRole(role);
//         } else {
//           console.log('No teacherId found');
//         }
//       } catch (error) {
//         console.log('Error fetching teacherId:', error);
//       }
//     };

//     fetchTeacherId();
//   }, []);

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => <LogoutButton />,
//     });
//   }, [navigation]);

//   const list = [
//     { index: '1', name: 'Courses', screen: 'TeacherCoursesScreen' },
//     { index: '2', name: 'Library Books', screen: 'LibraryScreen' },
//     { index: '3', name: 'My Books List', screen: 'MyBooksScreen' },
//     { index: '4', name: 'Students Log', screen: 'StudentLogsScreen' },
//     { index: '5', name: 'Profile', screen: 'StudentProfileScreen' },
//   ];

//   const navigateToScreen = (screenName) => {
//     navigation.navigate(screenName, { teacherId });
//   };

//   return (
//     <View>
//       <View style={styles.container}>
//         <Text style={styles.title}>Teacher Dashboard</Text>
//         {teacherId ? (
//           <Text style={styles.idText}>Teacher ID: {teacherId} and Role: {role}</Text>
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

// export default TeacherDashboard;
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import baseURL from '../../config';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
const TeacherDashboard = () => {
  const route = useRoute();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const {teacherId = null, isFirstLogin = 'False'} = route.params || {};
  const [username, setUserName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const storedUserName = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('userRole'); // Changed to 'userRole'
      setUserName(storedUserName);
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
          username: username,
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
      function: () =>
        navigation.navigate('TeacherCoursesScreen', {teacherId, role}),
    },
    {
      name: 'Library Books',
      icon: 'library-outline',
      function: () => navigation.navigate('LibraryScreen', {teacherId, role}),
    },
    {
      name: 'My Item',
      icon: 'save-outline',
      function: () => navigation.navigate('MyBooksScreen', {teacherId, role}),
    },
    {
      name: 'Student Logs',
      icon: 'timer-outline',
      function: () =>
        navigation.navigate('StudentLogsScreen', {teacherId, role}),
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      function: () =>
        navigation.navigate('TeacherProfileScreen', teacherId, role),
    },
  ];
  //{ title: 'Teacher Profile', type: 'Teacher' }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Teacher Dashboard {teacherId}</Text>
      <Text style={styles.roleText}>Role: {role}</Text> */}
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

export default TeacherDashboard;
