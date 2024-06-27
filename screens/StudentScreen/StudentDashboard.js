import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const id = await AsyncStorage.getItem('studentId');
        if (id !== null) {
          setStudentId(id);
        } else {
          console.log('No teacherId found');
        }
      } catch (error) {
        console.log('Error fetching teacherId:', error);
      }
    };

    fetchStudentId();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const list = [
    { index: '1', name: 'Courses', screen: 'CoursesScreen' },
    { index: '2', name: 'Library Books', screen: 'LibraryScreen' },
    { index: '3', name: 'My Books List', screen: 'MyCourseItemsScreen' },
    { index: '4', name: 'Profile', screen: 'StudentProfileScreen' },
  ];

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { studentId });
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>Student Dashboard</Text>
        {studentId ? (
          <Text style={styles.idText}>Student ID: {studentId}</Text>
        ) : (
          <Text style={styles.idText}>Loading...</Text>
        )}
      </View>
      <FlatList
        style={styles.listStyle}
        keyExtractor={(item) => item.index}
        data={list}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => navigateToScreen(item.screen)}>
              <Text style={styles.textStyle}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#7E7E7E"
  },
  idText: {
    fontSize: 18,
    color: 'black'
  },
  listStyle: {
    marginTop: 20,
    padding: 8,
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
});

export default StudentDashboard;
