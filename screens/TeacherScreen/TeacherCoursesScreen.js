import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../config';

const TeacherCoursesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        // Fetch teacherId from route params or AsyncStorage
        let teacherId = route.params?.teacherId;

        if (!teacherId) {
          teacherId = await AsyncStorage.getItem('teacherId');
        }

        if (!teacherId) {
          throw new Error('Teacher ID is missing');
        }

        console.log(`Fetching courses for teacherId: ${teacherId}`);

        // API call to fetch courses
        const response = await fetch(`${baseURL}/Course/getTeacherCourses?teacherId=${teacherId}`, {
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

    fetchTeacherCourses();
  }, [route.params]);

  if (loading) {
    return <Text>Loading...</Text>;
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
            onPress={() => navigation.navigate('CourseScreen', { course: item })}
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
