import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Ionicons';  
import CourseComponent from './customcomponent/coursecomponent'; // Adjust import path
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const CourseManagementScreen = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${baseURL}/course/getall`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data.data); // Assuming data structure is { data: [...courses], status: 'Success' }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };

  const handleAddCourse = () => {
    navigation.navigate('AddCourseScreen');
  };

  const handleEditCourse = (course) => {
    navigation.navigate('UpdateCourseScreen', { course });
  };

  const handleDeleteCourse = async (courseCode) => {
    try {
      const response = await fetch(`${baseURL}/Course/deleteCourse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseCode }),
      });
      const responseData = await response.json();
      if (response.ok) {
        // Course deleted successfully, update UI accordingly
        Alert.alert('Success', 'Course Deleted Successfully');
        // Optionally, you can remove the course from the state if you're using a state to manage courses
        // Remove the course from the state or reload the course list
      } else {
        // Course deletion failed, show error message
        console.log('Failed to delete course:', responseData);
        Alert.alert('Error', responseData.message || 'Failed to delete course');
      }
    } catch (error) {
      // An error occurred while deleting the course, show error message
      console.error('Error deleting course:', error);
      Alert.alert('Error', 'Failed to delete course. Please try again later.');
    }
  };

  const handleEnrollStudent = async (courseId) => {
    // Logic for enrolling student
    navigation.navigate('EnrollStudent', { courseId });
  };

  const handleEnrollTeacher = async (courseCode) => {
    // Logic for enrolling teacher
    navigation.navigate('AssignTeacher', { courseCode });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CourseComponent
        courses={courses}
        onEdit={handleEditCourse}
        onDelete={(courseCode) => handleDeleteCourse(courseCode)}
        onEnrollStudent={handleEnrollStudent}
        onEnrollTeacher={handleEnrollTeacher}
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
