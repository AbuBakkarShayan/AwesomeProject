import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import baseURL from '../../config';

const TeacherCoursesScreen = () => {
  const [courses, setCourses] = useState([]);

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
    <View>
      <Text>Teacher Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.courseCode.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.courseName}</Text>
            <Text>{item.creditHours}</Text>
            <Text>{item.courseCode}</Text>
            {/* Add more course details here */}
          </View>
        )}
      />
    </View>
  );
};

export default TeacherCoursesScreen;