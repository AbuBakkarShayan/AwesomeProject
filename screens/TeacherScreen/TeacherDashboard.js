import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const TeacherDashboard = () => {
  const [teacherId, setTeacherId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTeacherId = async () => {
      try {
        const id = await AsyncStorage.getItem('teacherId');
        if (id !== null) {
          setTeacherId(id);
        } else {
          console.log('No teacherId found');
        }
      } catch (error) {
        console.log('Error fetching teacherId:', error);
      }
    };

    fetchTeacherId();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const list = [
    { index: '1', name: 'Courses', screen: 'TeacherCoursesScreen' },
    { index: '2', name: 'Library Books', screen: 'LibraryScreen' },
    { index: '3', name: 'My Books List', screen: 'MyBooksScreen' },
    { index: '4', name: 'Students Log', screen: 'StudentLogsScreen' },
    { index: '5', name: 'Profile', screen: 'StudentProfileScreen' },
  ];

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { teacherId });
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>Teacher Dashboard</Text>
        {teacherId ? (
          <Text style={styles.idText}>Teacher ID: {teacherId}</Text>
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

export default TeacherDashboard;
