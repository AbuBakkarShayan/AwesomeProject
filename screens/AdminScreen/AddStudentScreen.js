import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const AddStudentScreen = () => {
  const navigation = useNavigation();
  const { departmentId, studentId } = useRoute().params;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${baseURL}/Student/getAllStudent?departmentid=${departmentId}`);
      const data = await response.json();
      if (data.status === 'Success') {
        setStudents(data.data);
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching students:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [departmentId])
  );

  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await fetch(`${baseURL}/user/deleteUser?studentId=${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'Student', id: studentId }),
      });

      const result = await response.json();

      if (result.status === 'Success') {
        Alert.alert('Success', result.message);
        setStudents(prevStudents => prevStudents.filter(student => student.studentId !== studentId));
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const confirmDelete = (studentId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDeleteStudent(studentId) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.userName}>{item.studentName}</Text>
      <View style={styles.iconContainer}>
        <Icon name="create-outline" style={styles.icon} onPress={() => navigation.navigate('EditStudentScreen', { student: item })} />
        <Icon name="trash" style={styles.icon} onPress={() => confirmDelete(item.studentId)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.studentId?.toString() || index.toString()}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddSingleStudent')}>
        <Text style={styles.addButtonLabel}>Add Student</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddStudentBatch')}>
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

export default AddStudentScreen;
