import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import baseURL from '../../config';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const LoginScreen1 = () => {
  const halfScreenHeight = screenHeight / 2.5;
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      // User is already logged in, navigate to the appropriate screen based on role
      const role = await AsyncStorage.getItem('userRole');
      navigateToDashboard(role);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginEndPoint = `${baseURL}/user/loginuser`;

  const handleLogin = async () => {
    try {
      const response = await fetch(loginEndPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.status === 'Success') {
          if (responseData.data && responseData.data.length > 0) {
            const role = responseData.data[0].role;
            await AsyncStorage.setItem('userToken', 'dummyToken'); // Store a dummy token for simplicity
            await AsyncStorage.setItem('userRole', role);
            navigateToDashboard(role);
          } else {
            Alert.alert('Login Failed', 'Invalid username or password.');
          }
        } else {
          Alert.alert('Login Failed', 'Invalid username or password.');
        }
      } else {
        Alert.alert('Failed to login', 'Please try again later.');
      }
    } catch (error) {
      console.log('Error: ', error);
      Alert.alert('An error occurred while logging in: ' + error.message);
    }
  };

  const navigateToDashboard = (role) => {
    switch (role) {
      case 'Student':
        navigation.navigate('StudentDashboard');
        break;
      case 'Teacher':
        navigation.navigate('TeacherDashboard');
        break;
      case 'Admin':
        navigation.navigate('AdminDashboard');
        break;
      default:
        navigation.navigate('LoginScreen1');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: halfScreenHeight, width: screenWidth, backgroundColor: '#5B5D8B', alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 30, color: "white" }}>Welcome!</Text>
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7E7E7E"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPassword}
          autoCapitalize='none'
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}><Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={25} color='#7E7E7E' /></TouchableOpacity>
      </View>

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
    marginTop: 25,
    fontSize: 24,
    marginBottom: 20,
    color: "#7E7E7E"
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    color: "black",
    marginBottom: 20,
    fontSize: 18,
    paddingHorizontal: 30,
    paddingRight: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: '100%'
  },
  iconContainer: {
    position: 'absolute',
    top: 12,
    right: 30,
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    width: 181,
    height: 59,
    backgroundColor: "#5B5D8B"
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default LoginScreen1;
