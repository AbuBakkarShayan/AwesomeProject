// CourseManagementScreen.js
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Ionicons';  
import CourseComponent from './customcomponent/coursecomponent'; // Adjust import path
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const CourseManagementScreen = () => {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleEditCourse = courseId => {
    navigation.navigate('UpdateCourseScreen', { courseId });
  };

  const handleDeleteCourse = async courseCode => {
    try {
      const response = await fetch(`${baseURL}/Course/deleteCourse/${courseCode}`, {
        method: 'DELETE',
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to delete course');
      }
      setCourses(prevCourses => prevCourses.filter(course => course.courseCode !== courseCode));
    } catch (error) {
      console.error('Error deleting course:', error);
      setError(error.message);
    }
};


  const handleEnrollStudent = async courseId => {
    // Logic for enrolling student
    navigation.navigate('EnrollStudent', { courseId });
  };

  const handleEnrollTeacher = async courseId => {
    // Logic for enrolling teacher
    navigation.navigate('AssignTeacher', { courseId });
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
        onDelete={handleDeleteCourse}
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
