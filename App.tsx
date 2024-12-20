// App.js

import React,{useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen1 from './screens/TeacherScreen/LoginScreen1';
import TeacherDashboard from './screens/TeacherScreen/TeacherDashboard';
import EditTeacherScreen from './screens/AdminScreen/EditTeacherScreen';
import TeacherCoursesScreen from './screens/TeacherScreen/TeacherCoursesScreen';
import AddTBookScreen from './screens/TeacherScreen/AddTBookScreen';
import EditTBookScreen from './screens/TeacherScreen/EditTBookScreen';
import TeacherProfileScreen from './screens/TeacherScreen/TeacherProfileScreen';
import DownloadedBooks from './screens/TeacherScreen/DownloadedBooks';
import CourseScreen from './screens/TeacherScreen/Courses';
import EditLessonPlan from './screens/TeacherScreen/EditLessonPlan';
import StudentLogsScreen from './screens/TeacherScreen/StudentsLogsScreen';
import StudentNamesScreen from './screens/TeacherScreen/StudentNamesScreen';
import StudentDashboard from './screens/StudentScreen/StudentDashboard';
import AdminDashboard from './screens/AdminScreen/AdminDashboard';
import CoursesScreen from './screens/StudentScreen/CoursesScreen';
import CourseMaterial from './screens/StudentScreen/CourseMaterial';
import BookmarkLessons from './screens/StudentScreen/BookmarkLessons';
import BookmarkBooks from './screens/StudentScreen/BookmarkBooks';
import Downloads from './screens/StudentScreen/Downloads/Downloads';
import LibraryScreen from './screens/LibraryScreen';
import MyCourseItemsScreen from './screens/StudentScreen/MyCourseItemsScreen';
import StudentHighlights from './screens/StudentScreen/StudentHighlights';
import StudentProfileScreen from './screens/StudentScreen/StudentProfileScreen';
import StudentDepartmentScreen from './screens/AdminScreen/StudentDepartmentScreen';
import UpdateDepartmentScreen from './screens/AdminScreen/UpdateDepartmentScreen';
import AddStudentScreen from './screens/AdminScreen/AddStudentScreen';
import AddStudentBatch from './screens/AdminScreen/AddStudentBatch';
import AddSingleStudent from './screens/AdminScreen/AddSingleStudent';
import EditStudentScreen from './screens/AdminScreen/EditStudentScreen';
import BooksManagementScreen from './screens/AdminScreen/BooksManagementScreen';
import EditBookScreen from './screens/AdminScreen/EditBookScreen';
import PDFReaderScreen from './screens/PDFReaderScreen';
import AssignBook from './screens/TeacherScreen/AssignBook';
import CourseManagementScreen from './screens/AdminScreen/CourseManagementScreen';
import AssignTeacher from './screens/AdminScreen/AssignTeacher';
import EnrollStudent from './screens/AdminScreen/EnrollStudent';
import EnrollMultipleStudents from './screens/AdminScreen/EnrollMultipleStudents';
import TeacherDepartmentScreen from './screens/AdminScreen/TeacherDepartmentScreen';
import TeachersScreen from './screens/AdminScreen/TeachersScreen';
import AddSingleTeacher from './screens/AdminScreen/AddSingleTeacher';
import AdminProfileScreen from './screens/AdminScreen/AdminProfileScreen';
import AddCourseScreen from './screens/AdminScreen/AddCourseScreen';
import UpdateCourseScreen from './screens/AdminScreen/UpdateCourseScreen';
import AddBookScreen from './screens/AdminScreen/AddBookScreen';
import AddTOC from './screens/AdminScreen/AddTOC';
import MyBooksScreen from './screens/TeacherScreen/MyBooksScreen';
import { navigate } from '@react-navigation/routers/lib/typescript/src/CommonActions';
import StudentLogs from './screens/TeacherScreen/StudentLogs';
import CourseWeeks from './screens/TeacherScreen/CourseWeeks';
import ShareReference from './screens/StudentScreen/ShareReference';

import Tester from './screens/Tester';


const Stack = createStackNavigator();

const App = () => {

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const uploaderId = await AsyncStorage.getItem('uploaderId');
  //     if (!uploaderId) {
  //       // Navigate to Login screen
  //       //navigation.navigate('LoginScreen1');
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);

  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="Splash" screenOptions={{
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
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={LoginScreen1}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="LoginScreen1" component={LoginScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} options={{title:'Teacher Dashboard'}} />
        <Stack.Screen name="EditTeacherScreen" component={EditTeacherScreen} options={{title:'Edit Teacher Details'
        }}/>
        <Stack.Screen name="TeacherCoursesScreen" component={TeacherCoursesScreen} options={{title:'Teacher Courses'
        }}/>
        <Stack.Screen name="AddTBookScreen" component={AddTBookScreen} options={{title:'Upload Book by Teacher'
        }}/>
        <Stack.Screen name="EditTBookScreen" component={EditTBookScreen} options={{title:'Edit Book'
        }}/>
        <Stack.Screen name="TeacherProfileScreen" component={TeacherProfileScreen} options={{title:'Teacher Profile'
        }}/>
        <Stack.Screen name='DownloadedBooks' component={DownloadedBooks} />
        <Stack.Screen name='EditLessonPlan' component={EditLessonPlan} options={{title:'EditLessonPlan'}} />
        <Stack.Screen name='CourseScreen' component={CourseScreen} options={{title:'Course'}}/>
        <Stack.Screen name='MyBooksScreen' component={MyBooksScreen} options={{title:'My Items'}}/>
        <Stack.Screen name='StudentLogsScreen' component={StudentLogsScreen} options={{title:"Semesters"}}/>
        <Stack.Screen name='StudentNamesScreen' component={StudentNamesScreen} options={{title:"Students"}}/>
        <Stack.Screen name='StudentLogs' component={StudentLogs} options={{title:"Student Logs"}}/>
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{title:'Admin Dashboard'}} />
        <Stack.Screen name="CoursesScreen" component={CoursesScreen} options={{title:'Courses'}} />
        <Stack.Screen name='CourseMaterial' component={CourseMaterial} options={{title:'Course Material'}}/>
        <Stack.Screen name='BookmarkLessons' component={BookmarkLessons} />
        <Stack.Screen name='BookmarkBooks' component={BookmarkBooks} />
        <Stack.Screen name='Downloads' component={Downloads} />

        <Stack.Screen name='LibraryScreen' component={LibraryScreen} options={{title:" Library Books"}} />
        <Stack.Screen name='MyCourseItemsScreen' component={MyCourseItemsScreen} options={{title:'Course Items'}} />
        <Stack.Screen name='StudentHighlights' component={StudentHighlights} options={{title:"Highlights"}}/>
        <Stack.Screen name='StudentProfileScreen' component={StudentProfileScreen} options={{title:"Profile"}} />
        <Stack.Screen name='StudentDepartmentScreen' component={StudentDepartmentScreen} options={{title:'Student Departments'}}/>
        <Stack.Screen name='UpdateDepartmentScreen' component={UpdateDepartmentScreen} options={{title:'Update Department Name'}}/>
        <Stack.Screen name='AddStudentScreen' component={AddStudentScreen} options={{title:'Students'}}/>
        <Stack.Screen name='AddStudentBatch' component={AddStudentBatch} options={{title:"Batch File"}}/>
        <Stack.Screen name='AddSingleStudent' component={AddSingleStudent} options={{title:'Add Single Student'}}/>
        <Stack.Screen name='EditStudentScreen' component={EditStudentScreen} options={{title:'Edit Student'}}/>
        <Stack.Screen name='TeacherDepartmentScreen' component={TeacherDepartmentScreen} options={{title:'Teacher Management'}}/>
        <Stack.Screen name='TeachersScreen' component={TeachersScreen} options={{title:'Teachers'}}/>
        <Stack.Screen name='AddSingleTeacher' component={AddSingleTeacher} options={{title:'Add Teacher'}}/>
        <Stack.Screen name='BooksManagementScreen' component={BooksManagementScreen} options={{title:"Books Management"}}/>
        <Stack.Screen name='EditBookScreen' component={EditBookScreen} options={{title:'Edit Book'}}/>
       <Stack.Screen name='PDFReaderScreen' component={PDFReaderScreen}/>
        <Stack.Screen name='AssignBook' component={AssignBook} options={{title:"Assign Book"}}/>


        <Stack.Screen name='CourseManagementScreen' component={CourseManagementScreen}  options={{title:'Course Management'}}/>
        <Stack.Screen name='AssignTeacher' component={AssignTeacher} options={{title:'Assign Teacher'}} />
        <Stack.Screen name="EnrollStudent" component={EnrollStudent} options={{title:'Single Student Enrollment'}}/>
        <Stack.Screen name='EnrollMultipleStudents' component={EnrollMultipleStudents} options={{title:'Multiple Student Enrollment'}}/>
        <Stack.Screen name='AddCourseScreen' component={AddCourseScreen} options={{title:'Add Course'}}  />
        <Stack.Screen name='UpdateCourseScreen' component={UpdateCourseScreen} options={{title:'Update Course'}}/>
        <Stack.Screen name='AddBookScreen' component={AddBookScreen} options={{title:'Add Book'}} />
        <Stack.Screen name='AddTOC' component={AddTOC} options={{title:'Add Table of Content'}}/>
        <Stack.Screen name='Tester' component={Tester} />
        <Stack.Screen name='AdminProfileScreen' component={AdminProfileScreen} options={{title:'Profile'}} />
        <Stack.Screen name='CourseWeeks' component={CourseWeeks} options={{title:'Course Weeks'}} />
        <Stack.Screen name='ShareReference' component={ShareReference} options={{title:'Share Reference'}} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default App;
