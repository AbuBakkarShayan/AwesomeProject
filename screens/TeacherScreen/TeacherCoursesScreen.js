// screens/TeacherCoursesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../config';

const TeacherCoursesScreen = ({route}) => {
  const { teacherId } = route.params;
  const [courses, setCourses] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      const response = await fetch(`${baseURL}/Course/getTeacherCourses?teacherId=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'Success') {
          setCourses(data.data);
        } else {
          console.log(data.message);
        }
      } else {
        console.log('Failed to fetch courses');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.courseCode.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseContainer}
            onPress={() => navigation.navigate('Course', { course: item })}
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
