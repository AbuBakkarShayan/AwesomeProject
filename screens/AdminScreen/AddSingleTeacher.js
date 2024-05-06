// AddSingleTeacherScreen.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddSingleUser from './customcomponent/AddSingleUser';

const AddSingleTeacher = () => {
  const handleUserSubmit = (data) => {
    // Handle user registration response
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <AddSingleUser userType="Teacher" onSubmit={handleUserSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default AddSingleTeacher;
