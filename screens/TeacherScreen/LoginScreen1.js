import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const LoginScreen1 = () => {
  const halfScreenHeight = screenHeight / 2.5;
  const navigation = useNavigation(); // Initialize navigation

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.121.86/FYPAPI/api/user/loginuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      //console.log('response', response);

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.status === 'Success') {
          // Check if data is present and has length > 0
          if (responseData.data && responseData.data.length > 0) {
            const role = responseData.data[0].role;
            // Save username and password to AsyncStorage
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);

            if (role === 'Student') {
              navigation.navigate('StudentDashboard');
            } else if (role === 'Teacher') {
              navigation.navigate('TeacherDashboard');
            } else if (role === 'Admin') {
              navigation.navigate('AdminDashboard');
            }
          } else {
            // No user data returned
            Alert.alert('Login Failed', 'Invalid username or password.');
          }
        } else {
          // Failed status from the backend
          Alert.alert('Login Failed', 'Invalid username or password.');
        }
      } else {
        // HTTP error (e.g., 404, 500)
        Alert.alert('Failed to login', 'Please try again later.');
      }
      
    } catch (error) {
      console.log('Error: ', error); // Log the error to the console
      Alert.alert('An error occurred while logging in: ' + error.message); // Display a detailed error message to the user
    }
    
  };

  return (
    <View style={styles.container}>
      <View style={{ height: halfScreenHeight,width: screenWidth, backgroundColor: '#5B5D8B', alignItems: "center", justifyContent:"center"}}>
        <Text style={{fontSize:30,color:"white"}}>Welcome!</Text>
      </View>
      <Text style={styles.title}>Please Sign in to Continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#7E7E7E"
        onChangeText={setUsername}
        value={username}
        autoCapitalize='none'
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7E7E7E"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize='none'
      />
      
      <TouchableOpacity onPress={handleLogin} style={styles.buttonStyle}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );

};


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  title: {
    marginTop:25,
    fontSize: 24,
    marginBottom: 20,
    color:"#7E7E7E"
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginBottom: 10,
    paddingHorizontal: 10,
    color:"black",
    marginBottom:20,
    fontSize:18,
    paddingHorizontal:30
  },
  buttonStyle:{
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:45,
    width:181,
    height:59,
    backgroundColor:"#5B5D8B"
  },
  buttonText:{
    color: 'white', // Default text color
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default LoginScreen1;

