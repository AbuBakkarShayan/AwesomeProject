import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import UserListComponent from './customcomponent/userComponent';
import { useNavigation, useRoute } from '@react-navigation/native';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const TeachersScreen = () => {
  const navigation = useNavigation();
  const { departmentId } = useRoute().params;
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${baseURL}/Teacher/getAllTeacher?departmentid=${departmentId}`);
        const data = await response.json();
        if (data.status === 'Success') {
          setTeachers(data.data);
        } else {
          throw new Error(data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching teachers:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [departmentId]);

  const handleDeleteTeacher = (teacherId) => {
    setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.id !== teacherId));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <UserListComponent
          users={teachers}
          onDeleteUser={handleDeleteTeacher}
          addButtonLabel="Add Teacher"
          onAddOptionPress={() => navigation.navigate('AddSingleTeacher')}
          onAddBatchPress={() => navigation.navigate('AddTeacherBatch')}
          userRole="Teacher"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default TeachersScreen;
