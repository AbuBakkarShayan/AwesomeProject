import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Ionicons';  
import CourseComponent from './customcomponent/coursecomponent';

const CourseManagementScreen = () => {
  const navigation = useNavigation();

  if (!navigation) {
    console.error("Navigation is undefined. Make sure CourseManagementScreen is inside a navigation container.");
    return null; // Or render a fallback component
  }

  const handleAddCourse = () => {
    navigation.navigate('AddCourseScreen');
  };

  // Dummy data for course items
  const [courses, setCourses] = React.useState([
    { id: 1, name: 'Programming Fundamental' },
    { id: 2, name: 'ICT' },
    // Add more course items as needed
  ]);

  // Event handlers
  const handleEditCourse = courseId => {
    // Navigate to the EditCourseScreen, passing the courseId as a parameter
    navigation.navigate('UpdateCourse', { courseId });
  };

  const handleDeleteCourse = courseId => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this course?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Logic for handling delete course
            setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleEnrollStudent = courseId => {
    // Logic for handling enroll student
    navigation.navigate('EnrollStudentScreen', { courseId });
  };

  const handleEnrollTeacher = courseId => {
    // Logic for handling enroll teacher
    navigation.navigate('AssignTeacher', { courseId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CourseComponent
            courseName={item.name}
            onEdit={() => handleEditCourse(item.id)}
            onDelete={() => handleDeleteCourse(item.id)}
            onEnrollStudent={() => handleEnrollStudent(item.id)}
            onEnrollTeacher={() => handleEnrollTeacher(item.id)}
            navigation={navigation}
          />
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Icon name="add-circle-outline" size={60} color="#5B5D8B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default CourseManagementScreen;
