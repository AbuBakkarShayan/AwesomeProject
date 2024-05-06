// AddSingleStudentScreen.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddSingleUser from './customcomponent/AddSingleUser';

const AddSingleStudent = () => {
  const handleUserSubmit = (data) => {
    // Handle user registration response
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <AddSingleUser userType="Student" onSubmit={handleUserSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
});

export default AddSingleStudent;
