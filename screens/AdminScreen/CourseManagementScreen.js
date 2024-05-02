import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Ionicons';  
import CourseComponent from './customcomponent/coursecomponent';
import baseURL from '../../config';

const CourseManagementScreen = () => {
  const navigation = useNavigation();
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseURL}/department/alldepartment`);
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError(error.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${baseURL}/course/getall`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    navigation.navigate('AddCourseScreen');
  };

  const handleEditCourse = courseId => {
    navigation.navigate('UpdateCourseScreen', { courseId });
  };

  const handleDeleteCourse = async courseId => {
    try {
      const response = await fetch(`${baseURL}/course/deletecourse/${courseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
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
