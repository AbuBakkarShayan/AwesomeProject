import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Ionicons';
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
    if (!courseCode || courseCode.trim() === '') {
      Alert.alert("Failed", "Course Code required");
      return;
    }
  
    console.log('Initiating delete request for course:', courseCode);
  
    try {
      const response = await fetch(`${baseURL}/Course/deleteCourse?courseCode=${courseCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      const responseData = await response.json();
  
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);
  
      if (response.ok) {
        Alert.alert('Success', 'Course Deleted Successfully');
        setCourses(courses.filter(course => course.courseCode !== courseCode));
      } else {
        console.log('Failed to delete course:', responseData);
        Alert.alert('Error', responseData.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      Alert.alert('Error', 'Failed to delete course. Please try again later.');
    }
  };
  
  const confirmDeleteCourse = (courseCode) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this course?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete Cancelled'),
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteCourse(courseCode),
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  const handleEnrollStudent = async (courseId) => {
    // Logic for enrolling student
    navigation.navigate('EnrollStudent', { courseId });
  };

  const handleEnrollTeacher = async (courseCode) => {
    // Logic for enrolling teacher
    navigation.navigate('AssignTeacher', { courseCode });
  };

  const renderCourseItem = ({ item }) => (
    <View style={styles.courseContainer}>
      <Text style={styles.courseName}>{item.courseName}</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => handleEditCourse(item)}>
          <Icon name="create-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDeleteCourse(item.courseCode)}>
          <Icon name="trash-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEnrollStudent(item.id)}>
          <Icon name="person-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEnrollTeacher(item.courseCode)}>
          <Icon name="school-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={renderCourseItem}
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
  courseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  courseName: {
    fontSize: 16,
    color: "#C4C4C4",
  },
  iconsContainer: {
    flexDirection: 'row',
  },
});

export default CourseManagementScreen;
