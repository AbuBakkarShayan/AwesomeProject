// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, NavigationContainer } from 'react-native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Courses from './Courses';
// import MyBooks from './MyBooks';
// import LibraryBooks from './LibraryBooks';
// import StudentLogs from './StudentsLogs';


// const Stack = createStackNavigator();


// const TeacherDashboard = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.option} title="Courses" onPress={() => navigation.navigate('Courses')}>
//         <Text>Courses</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.option} title="Courses" onPress={() => navigation.navigate('LibraryBooks')}>
//         <Text>Library Books</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.option} title="Courses" onPress={() => navigation.navigate('MyBooks')}>
//         <Text>My Books</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.option} title="Courses" onPress={() => navigation.navigate('StudentLogs')}>
//         <Text>Student Logs</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const TeacherDashboardNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
       
//         <Stack.Screen name="Courses" component={Courses} />
//         <Stack.Screen name="LibraryBooks" component={LibraryBooks} />
//         <Stack.Screen name="MyBooks" component={MyBooks} />
//         <Stack.Screen name="StudentLogs" component={StudentLogs} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   option: {
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//   },
//   screen: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default TeacherDashboardNavigator;
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function TeacherDashboard() {
  return (
    <View>
      <Text>TeacherDashboard</Text>
    </View>
  )
}

const styles = StyleSheet.create({})