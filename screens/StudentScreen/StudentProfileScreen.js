import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { navigate } from '@react-navigation/routers/lib/typescript/src/CommonActions';
import { useNavigation } from '@react-navigation/core';


const StudentProfileScreen = () => {
  const navigation=useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedPassword = await AsyncStorage.getItem('password');
        console.log('Stored Username:', storedUsername);
        if (storedUsername !== null) {
          setUsername(storedUsername);
          setPassword(storedPassword);
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };
    fetchData();
  }, []);
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username: {username}</Text>
      <Text style={styles.text}>Password: {password}</Text>
      <TouchableOpacity onPress={()=> navigation.navigate('LoginScreen1')} style={styles.buttonStyle}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color:"black",
  },
  buttonText:{
    color: 'white', // Default text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonStyle:{
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:45,
    width:181,
    height:59,
    backgroundColor:"#5B5D8B"
  }
});

export default StudentProfileScreen;