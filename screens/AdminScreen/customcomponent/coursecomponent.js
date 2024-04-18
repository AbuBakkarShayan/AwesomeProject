import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CourseComponent = ({ courseName, onEdit, onDelete, onEnrollStudent, onEnrollTeacher, navigation }) => {
  const navigateToEditScreen = () => {
    // Navigate to the edit screen
    navigation.navigate('UpdateCourseScreen');
  };

  const navigateToDeleteScreen = () => {
    // Navigate to the delete screen
    navigation.navigate('DeleteCourseScreen');
  };

  const navigateToEnrollStudentScreen = () => {
    // Navigate to the enroll student screen
    navigation.navigate('EnrollStudentScreen');
  };

  const navigateToEnrollTeacherScreen = () => {
    // Navigate to the enroll teacher screen
    navigation.navigate('EnrollTeacherScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.courseName}>{courseName}</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={navigateToEditScreen}>
          <Icon name="create-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToDeleteScreen}>
          <Icon name="trash-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToEnrollStudentScreen}>
          <Icon name="person-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToEnrollTeacherScreen}>
          <Icon name="school-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  courseName: {
    fontSize: 16,
    color:"#C4C4C4",
  },
  iconsContainer: {
    flexDirection: 'row',
  },
});

export default CourseComponent;
