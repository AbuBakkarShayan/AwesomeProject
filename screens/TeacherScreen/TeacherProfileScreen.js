import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../config';

const TeacherProfileScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserDetails = async () => {
      const storedName = await AsyncStorage.getItem('name');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPhoneNo = await AsyncStorage.getItem('phoneNo');
      const storedPassword = await AsyncStorage.getItem('password');
      if (storedName) setName(storedName);
      if (storedUsername) setUsername(storedUsername);
      if (storedPhoneNo) setPhoneNo(storedPhoneNo);
      if (storedPassword) setPassword(storedPassword);
    };
    getUserDetails();
  }, []);

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleUpdatePassword = () => {
    Alert.alert(
      'Update Password',
      'If you update the password, you must log out. Do you want to proceed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await fetch(`${baseURL}/user/updatePassword`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
              });
              const result = await response.json();
              if (result.status === 'Success') {
                await AsyncStorage.clear();
                navigation.navigate('LoginScreen1');
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while updating the password.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.clear();
            
            navigation.navigate('LoginScreen1');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Icon name="person" size={24} color={"#7E7E7E"} />
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Icon name="mail" size={24} color={"#7E7E7E"} />
        <Text style={styles.label}>UserName:</Text>
        <Text style={styles.value}>{username}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Icon name="call" size={24} color={"#7E7E7E"} />
        <Text style={styles.label}>Phone No:</Text>
        <Text style={styles.value}>{phoneNo}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Icon name="lock-closed" size={24} color={"#7E7E7E"} />
        <Text style={styles.label}>Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={handlePasswordToggle}>
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color={"#7E7E7E"} style={styles.eyeIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUpdatePassword}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color:'#7E7E7E',
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
    color:'#7E7E7E',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    color:'#7E7E7E',
  },
  updateButtonText: {
    marginLeft: 10,
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eyeIcon:{
    marginRight:100,
  }
});

export default TeacherProfileScreen;
