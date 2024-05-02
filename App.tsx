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
import TeacherCoursesScreen from './screens/TeacherScreen/TeacherCoursesScreen';
import StudentLogsScreen from './screens/TeacherScreen/StudentsLogsScreen';
import StudentDashboard from './screens/StudentScreen/StudentDashboard';
import AdminDashboard from './screens/AdminScreen/AdminDashboard';
import CoursesScreen from './screens/StudentScreen/CoursesScreen';
import LibraryBooksScreen from './screens/LibraryBooksScreen';
import MyCourseItemsScreen from './screens/StudentScreen/MyCourseItemsScreen';
import StudentProfileScreen from './screens/StudentScreen/StudentProfileScreen';
import StudentDepartmentScreen from './screens/AdminScreen/StudentDepartmentScreen';
import AddStudentScreen from './screens/AdminScreen/AddStudentScreen';
import AddStudentBatch from './screens/AdminScreen/AddStudentBatch';
import AddSingleStudent from './screens/AdminScreen/AddSingleStudent';
import BooksManagementScreen from './screens/AdminScreen/BooksManagementScreen';
import CourseManagementScreen from './screens/AdminScreen/CourseManagementScreen';
import AssignTeacher from './screens/AdminScreen/AssignTeacher';
import EnrollStudent from './screens/AdminScreen/EnrollStudent';
import CourseComponent from './screens/AdminScreen/customcomponent/coursecomponent';
import TeacherDepartmentScreen from './screens/AdminScreen/TeacherDepartmentScreen';
import TeachersScreen from './screens/AdminScreen/TeachersScreen';
import AdminProfileScreen from './screens/AdminScreen/AdminProfileScreen';
import AddCourseScreen from './screens/AdminScreen/AddCourseScreen';
import UpdateCourseScreen from './screens/AdminScreen/UpdateCourseScreen';
import AddBookScreen from './screens/AdminScreen/AddBookScreen';
import AddTOC from './screens/AdminScreen/AddTOC';
import MyBooksScreen from './screens/TeacherScreen/MyBooksScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen1" screenOptions={{
        headerStyle: {
          height: 80,
          backgroundColor: '#5B5D8B', // Customize header background color

        },
        headerTitleStyle: {
          fontSize: 20, // Customize header title font size
          textAlign: "center"
        },
        headerTintColor: 'white', // Customize header text color
        headerTitleAlign: "center"
      }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />
        <Stack.Screen name="CounterScreen" component={CounterScreen} />
        <Stack.Screen name="ColorScreen" component={ColorScreen} />
        <Stack.Screen name="LoginScreen1" component={LoginScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="TeacherCoursesScreen" component={TeacherCoursesScreen} />
        <Stack.Screen name='MyBooksScreen' component={MyBooksScreen} />
        <Stack.Screen name='StudentLogsScreen' component={StudentLogsScreen} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="CoursesScreen" component={CoursesScreen} />
        <Stack.Screen name='LibraryBooksScreen' component={LibraryBooksScreen} />
        <Stack.Screen name='MyCourseItemsScreen' component={MyCourseItemsScreen} />
        <Stack.Screen name='StudentProfileScreen' component={StudentProfileScreen} />
        <Stack.Screen name='StudentDepartmentScreen' component={StudentDepartmentScreen} options={{title:'Student Departments'}}/>
        <Stack.Screen name='AddStudentScreen' component={AddStudentScreen} options={{title:'Students'}}/>
        <Stack.Screen name='AddStudentBatch' component={AddStudentBatch} />
        <Stack.Screen name='AddSingleStudent' component={AddSingleStudent} />
        <Stack.Screen name='TeacherDepartmentScreen' component={TeacherDepartmentScreen} options={{title:'Teacher Departments'}}/>
        <Stack.Screen name='TeachersScreen' component={TeachersScreen} options={{title:'Teachers'}}/>
        <Stack.Screen name='BooksManagementScreen' component={BooksManagementScreen} />
        <Stack.Screen name='CourseManagementScreen' component={CourseManagementScreen} />
        <Stack.Screen name='AssignTeacher' component={AssignTeacher} />
        <Stack.Screen name="EnrollStudent" component={EnrollStudent} />
        <Stack.Screen name='AddCourseScreen' component={AddCourseScreen} />
        <Stack.Screen name='UpdateCourseScreen' component={UpdateCourseScreen} />
        <Stack.Screen name='AddBookScreen' component={AddBookScreen} />
        <Stack.Screen name='AddTOC' component={AddTOC} />
        <Stack.Screen name='AdminProfileScreen' component={AdminProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
