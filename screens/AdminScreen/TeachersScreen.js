import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${baseURL}/teacher/getAllTeacher?departmentid=${departmentId}`);
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

  useFocusEffect(
    useCallback(() => {
      fetchTeachers();
    }, [departmentId])
  );

  const handleDeleteTeacher = async (teacherId) => {
    try {
      const response = await fetch(`${baseURL}/user/deleteUser?teacherId=${teacherId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'Teacher', id: teacherId }),
      });

      const result = await response.json();

      if (result.status === 'Success') {
        Alert.alert('Success', result.message);
        setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.teacherId !== teacherId));
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const confirmDelete = (teacherId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this teacher?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDeleteTeacher(teacherId) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.userName}>{item.teacherName}</Text>
      <View style={styles.iconContainer}>
        <Icon name="create-outline" style={styles.icon} onPress={() => navigation.navigate('EditTeacherScreen', { teacher: item })} />
        <Icon name="trash" style={styles.icon} onPress={() => confirmDelete(item.teacherId)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={teachers}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.teacherId?.toString() || index.toString()}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddSingleTeacher')}>
        <Text style={styles.addButtonLabel}>Add Teacher</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTeacherBatch')}>
        <Text style={styles.addButtonLabel}>Add Batch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  userName: {
    fontSize: 16,
    color: '#7E7E7E',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
    fontSize: 20,
    color: '#7E7E7E',
  },
  addButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  addButtonLabel: {
    color: '#5B5D8B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeachersScreen;
