// import React from 'react';
// import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Import navigation hook
// import LogoutButton from './customcomponent/logoutComponent';
// import Icon from 'react-native-vector-icons/Ionicons';
// import PDFReaderScreen from '../PDFReaderScreen';

// const AdminDashboard = () => {

//   //logout icon in header
//   React.useLayoutEffect(()=>{
//     navigation.setOptions({
//       headerRight:()=><LogoutButton />,
//     });
//   }, [navigation]);

//   const navigation = useNavigation(); // Initialize navigation

//   const list = [
//     { index: '1', name: 'Student Management', icon: 'person-outline' },
//     { index: '2', name: 'Teacher Management' , icon:'school-outline' },
//     { index: '3', name: 'Course Management' },
//     { index: '4', name: 'Books Management', icon: 'book-outline', },
//     { index: '5', name: 'Profile', icon: 'person-outline', },
//   ];

//   const handleItemPress = async (itemName) => {
//     try {
//       // Navigate to the corresponding screen based on the item name
//       if (itemName === 'Student Management') {
//         navigation.navigate('StudentDepartmentScreen');
//       } else if (itemName === 'Teacher Management') {
//         navigation.navigate('TeacherDepartmentScreen');
//       } else if (itemName === 'Course Management') {
//         navigation.navigate('CourseManagementScreen');
//       } else if (itemName === 'Books Management') {
//         navigation.navigate('BooksManagementScreen');
//       } else if (itemName === 'Profile') {
//         navigation.navigate('AdminProfileScreen');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         style={styles.listStyle}
//         keyExtractor={(item) => item.index}
//         data={list}
//         renderItem={({ item }) => (
//           <TouchableOpacity  style={styles.tile} onPress={() => handleItemPress(item.name)}>
//             <View style={styles.listItem}>
//             <Icon name={item.icon} size={40} style={styles.icon} />
//               <Text style={styles.textStyle}>{item.name}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#ccc',
//   },
//   listStyle: {
//     marginTop: 20,
//     padding:8
//   },
//   listItem: {
//     backgroundColor: '#5B5D8B',
//     margin: 5,
//     padding: 10,
//     borderRadius: 10,
//   },
//   textStyle: {
//     fontSize: 18,
//     color: 'white',
//     textAlign:"center"

//   },
//   tile: {
//    fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: 'black',
//   },
//   icon: {
//     marginRight: 20,
//     color: 'white',
//   },
// });

// export default AdminDashboard;

import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LogoutButton from './customcomponent/logoutComponent';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminDashboard = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();

  const dashboardData = [
    {
      name: 'Student Management',
      icon: 'person-outline',
      function: () => navigation.navigate('StudentDepartmentScreen'),
    },
    {
      name: 'Teacher Management',
      icon: 'school-outline',
      function: () => navigation.navigate('TeacherDepartmentScreen'),
    },
    {
      name: 'Course Management',
      icon: 'document-outline',
      function: () => navigation.navigate('CourseManagementScreen'),
    },
    {
      name: 'Books Management',
      icon: 'book-outline',
      function: () => navigation.navigate('BooksManagementScreen'),
    },
    {
      name: 'Profile',
      icon: 'person-outline',
      function: () => navigation.navigate('AdminProfileScreen'),
    },
  ];

  return (
    <View style={styles.container}>
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

export default AdminDashboard;
