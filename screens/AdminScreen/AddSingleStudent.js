import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';


const AddSingleStudent = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={"#7E7E7E"}
      />
      <TextInput
        style={styles.input}
        placeholder="username"
        placeholderTextColor={"#7E7E7E"}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"#7E7E7E"}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor={"#7E7E7E"}
      />
      <TextInput
        style={styles.input}
        placeholder="Department"
        placeholderTextColor={"#7E7E7E"}
      />
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color:"black",
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

export default AddSingleStudent;