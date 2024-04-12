// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import ImageScreen from './screens/ImageScreen';
import CounterScreen from './screens/CounterScreen';
import ColorScreen from './screens/ColorScreen';
import LoginScreen1 from './screens/TeacherScreen/LoginScreen1';
import TScreenComponent from './screens/Components/TScreenComponent';
import TeacherDashboard from './screens/TeacherScreen/TeacherDashboard';
import StudentLogsScreen from './screens/TeacherScreen/StudentsLogsScreen';
import StudentDashboard from './screens/StudentScreen/StudentDashboard';
import AdminDashboard from './screens/AdminScreen/AdminDashboard';
import CoursesScreen from './screens/StudentScreen/CoursesScreen';
import LibraryBooksScreen from './screens/LibraryBooksScreen';
import MyCourseItemsScreen from './screens/StudentScreen/MyCourseItemsScreen';
import StudentProfileScreen from './screens/StudentScreen/StudentProfileScreen';
import StudentDepartmentScreen from './screens/AdminScreen/StudentDepartmentScreen';
import BooksManagementScreen from './screens/AdminScreen/BooksManagementScreen';
import CourseManagementScreen from './screens/AdminScreen/CourseManagementScreen';
import TeacherDepartmentScreen from './screens/AdminScreen/TeacherDepartmentScreen';
import AdminProfileScreen from './screens/AdminScreen/AdminProfileScreen';
import MyBooksScreen from './screens/TeacherScreen/MyBooksScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen1"  screenOptions={{
        headerStyle: {
          height: 80,
          backgroundColor: '#5B5D8B', // Customize header background color
          
        },
        headerTitleStyle: {
          fontSize: 20, // Customize header title font size
          textAlign:"center"
        },
        headerTintColor: 'white', // Customize header text color
        headerTitleAlign:"center"
      }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />
        <Stack.Screen name="CounterScreen" component={CounterScreen} />
        <Stack.Screen name="ColorScreen" component={ColorScreen} />
        <Stack.Screen name="LoginScreen1" component={LoginScreen1} options={{headerShown:false}} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name='MyBooksScreen' component={MyBooksScreen} />
        <Stack.Screen name='StudentLogsScreen' component={StudentLogsScreen} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="CoursesScreen" component={CoursesScreen} />
        <Stack.Screen name='LibraryBooksScreen' component={LibraryBooksScreen} />
        <Stack.Screen name='MyCourseItemsScreen' component={MyCourseItemsScreen} />
        <Stack.Screen name='StudentProfileScreen' component={StudentProfileScreen} />
        <Stack.Screen name='StudentDepartmentScreen' component={StudentDepartmentScreen} />
        <Stack.Screen name='TeacherDepartmentScreen' component={TeacherDepartmentScreen} />
        <Stack.Screen name='BooksManagementScreen' component={BooksManagementScreen} />
        <Stack.Screen name='CourseManagementScreen' component={CourseManagementScreen} />
        <Stack.Screen name='AdminProfileScreen' component={AdminProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
