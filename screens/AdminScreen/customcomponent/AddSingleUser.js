// AddSingleUser.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import baseURL from '../../../config';

const AddSingleUser = ({ userType, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Make API call to register user
      const response = await fetch(`${baseURL}/user/registeruser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role: userType,
          name,
          phoneNo,
          department,
        }),
      });
      const data = await response.json();
      // Handle response
      console.log(data);
      setLoading(false);
      onSubmit(data);
    } catch (error) {
      console.error('Error registering user:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#7E7E7E"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7E7E7E"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#7E7E7E"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#7E7E7E"
        value={phoneNo}
        onChangeText={setPhoneNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Department"
        placeholderTextColor="#7E7E7E"
        value={department}
        onChangeText={setDepartment}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add {userType}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
   // alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color: 'black',
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddSingleUser;
