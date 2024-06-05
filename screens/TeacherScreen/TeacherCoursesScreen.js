
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
import { useNavigation, useRoute } from '@react-navigation/core';

export default function TeacherCoursesScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { teacherId } = route.params; // Get teacherId from route params

  // Ensure teacherId is available
  if (!teacherId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Teacher ID is not available</Text>
      </View>
    );
  }

  // Logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  // Fetch courses from API
  useEffect(() => {
    fetch(`${baseURL}/Course/getTeacherCourses?teacherId=${teacherId}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'Success') {
          setCourses(result.data);
        } else {
          setError(result.message);
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [teacherId]);

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listStyle}
        keyExtractor={(item) => item.courseCode}
        data={courses}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => navigateToScreen('CourseMaterial')}>
              <Text style={styles.textStyle}>{item.courseName}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  listStyle: {
    marginTop: 20,
  },
  listItem: {
    backgroundColor: '#5B5D8B',
    margin: 5,
    padding: 20,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
