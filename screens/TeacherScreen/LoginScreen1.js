import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert , Dimensions, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const LoginScreen = () => {
  
  const halfScreenHeight = screenHeight / 2.5;
  const navigation = useNavigation(); // Initialize navigation

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.12.180/FYPAPI/api/user/LoginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'user found') {
          // Check role and navigate accordingly
          if (data.data[0].role === 'Student') {
            // Navigate to Student screen
            navigation.navigate('StudentDashboard');
          } else if (data.data[0].role === 'Teacher') {
            // Navigate to Teacher screen
            navigation.navigate('TeacherDashboard');
          } else {
            // Navigate to Admin screen
            navigation.navigate('AdminDashboard');
          }
        } else {
          Alert.alert('Login Failed' ,'Invalid username or password.');
        }
      } else {
        Alert.alert("Failed to login", "Please try again later.");
      }
    } catch (error) {
      Alert.alert('Error:', error);
      Alert.alert('An error occurred while logging in.');
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7E7E7E"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
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

export default LoginScreen;


