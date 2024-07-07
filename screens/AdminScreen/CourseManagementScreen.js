import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, Modal } from 'react-native';
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);

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

  const handleEnrollStudent = (courseCode) => {
    setSelectedCourseCode(courseCode);
    setModalVisible(true);
  };

  const handleEnrollSingleStudent = () => {
    setModalVisible(false);
    navigation.navigate('EnrollStudent', { courseCode: selectedCourseCode });
  };

  const handleEnrollMultipleStudents = () => {
    setModalVisible(false);
    navigation.navigate('EnrollMultipleStudent', { courseCode: selectedCourseCode });
  };

  const handleEnrollTeacher = (courseCode) => {
    navigation.navigate('AssignTeacher', { courseCode });
  };

  const renderCourseItem = ({ item }) => (
    <View style={styles.courseContainer}>
      <View style={styles.courseDetails}>
        <Icon name="book-outline" size={20} color="white" style={styles.courseIcon} />
        <Text style={styles.courseName}>{item.courseName}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEditCourse(item)}>
            <Icon name="create-outline" style={styles.courseIcon} size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteCourse(item.courseCode)}>
            <Icon style={styles.courseIcon} name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEnrollStudent(item.courseCode)}>
            <Icon style={styles.courseIcon} name="person-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEnrollTeacher(item.courseCode)}>
            <Icon style={styles.courseIcon} name="school-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
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
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleEnrollSingleStudent} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Enroll Single Student</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEnrollMultipleStudents} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Enroll Multiple Students</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#5B5D8B',
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
    width: '95%',
  },
  courseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseIcon: {
    marginRight: 5,
  },
  courseName: {
    fontSize: 16,
    color: 'white',
  },
  iconsContainer: {
    flexDirection: 'column',
   // marginLeft:5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
    //marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CourseManagementScreen;
