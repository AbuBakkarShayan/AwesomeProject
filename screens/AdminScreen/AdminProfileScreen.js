import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { navigate } from '@react-navigation/routers/lib/typescript/src/CommonActions';
import { useNavigation } from '@react-navigation/core';


const AdminProfileScreen = () => {
  const navigation=useNavigation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        console.log('Stored Username:', storedUsername);
        if (storedUsername !== null) {
          setUsername(storedUsername);
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

export default AdminProfileScreen;