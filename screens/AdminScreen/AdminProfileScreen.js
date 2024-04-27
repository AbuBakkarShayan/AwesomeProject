import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';

const AdminProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      await AsyncStorage.removeItem('lastScreen');
      await AsyncStorage.removeItem('userRole');
      navigation.navigate('LoginScreen1');
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedPassword = await AsyncStorage.getItem('password');
        console.log('Stored Username:', storedUsername);
        console.log('Stored Password: ', storedPassword);
        if (storedUsername !== null && storedPassword !== null) {
          setUsername(storedUsername);
          setPassword(storedPassword);
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      const removedUsername = await AsyncStorage.getItem('username');

      // Check if the username was successfully removed from AsyncStorage
      if (removedUsername === null) {
        console.log("Username is successfully removed from AsyncStorage");
        navigation.navigate('LoginScreen1');
      } else {
        console.log('Failed to remove username from AsyncStorage');
      }
    } catch (error) {
      console.log("Error cleaning AsyncStorage: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{username}</Text>
      <Text style={styles.label}>Password:</Text>
      <Text style={styles.value}>{password}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.buttonStyle}>
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // dark gray
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: 'black', // medium gray
  },
  buttonText: {
    color: '#fff', // white
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 45,
    marginTop: 20,
    backgroundColor: "#5B5D8B"
  }
});

export default AdminProfileScreen;
