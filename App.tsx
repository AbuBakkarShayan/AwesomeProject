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
import StudentDashboard from './screens/StudentScreen/StudentDashboard';
import AdminDashboard from './screens/AdminScreen/AdminDashboard';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />
        <Stack.Screen name="CounterScreen" component={CounterScreen} />
        <Stack.Screen name="ColorScreen" component={ColorScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen1} options={{headerShown:false}} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
