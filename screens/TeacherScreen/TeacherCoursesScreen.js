import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../config';

const TeacherCoursesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherId, setTeacherId] = useState(null); // State to store teacherId

  useEffect(() => {
    const fetchTeacherId = async () => {
      try {
        const id = await AsyncStorage.getItem('teacherId');
        if (id !== null) {
          setTeacherId(id);
        } else {
          console.log('No teacherId found');
          throw new Error('Teacher ID is missing');
        }
      } catch (error) {
        console.log('Error fetching teacherId:', error);
        setError(error.message || 'Failed to fetch teacherId');
      }
    };

    fetchTeacherId();
  }, []);

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        // Fetch teacherId from route params or AsyncStorage
        let fetchedTeacherId = route.params?.teacherId;

        if (!fetchedTeacherId) {
          fetchedTeacherId = teacherId; // Use teacherId from state if not provided in route params
        }

        if (!fetchedTeacherId) {
          throw new Error('Teacher ID is missing');
        }

        console.log(`Fetching courses for teacherId: ${fetchedTeacherId}`);

        // API call to fetch courses
        const response = await fetch(`${baseURL}/Course/getTeacherCourses?teacherId=${fetchedTeacherId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(`API Response Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log('API Response Data:', data);

          if (data.status === 'Success') {
            setCourses(data.data); // Ensure this matches the structure of your response
            console.log('Courses set to state:', data.data);
          } else {
            console.log('API Error Message:', data.message);
            setError(data.message || 'Failed to fetch courses');
          }
        } else {
          const errorText = await response.text();
          console.log('Response not OK:', errorText);
          setError(`Failed to fetch courses: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setError(error.message || 'An error occurred while fetching courses');
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherCourses();
    }
  }, [route.params, teacherId]);

  if (loading) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color="#7d6dc1" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.courseCode.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseContainer}
            onPress={() => navigation.navigate('CourseScreen', { course: item, teacherId })} // Pass teacherId to CourseScreen
          >
            <Text style={styles.courseName}>{item.courseName}</Text>
            <Text style={styles.creditHour}>Credit Hours: {item.creditHours}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
  },
  creditHour: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default TeacherCoursesScreen;
