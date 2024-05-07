import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import UserListComponent from './customcomponent/userComponent';
import { useNavigation, useRoute } from '@react-navigation/native';
import baseURL from '../../config';


const textColor = 'gray'; // Define a textColor variable

const AddStudentScreen = () => {
  const navigation = useNavigation();
  const { departmentId } = useRoute().params; // Destructure departmentId directly
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${baseURL}/Student/getAllStudent?departmentid=${departmentId}`);
        const data = await response.json();
        console.log('Fetched data:', data);
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

    fetchStudents();
  }, [departmentId]);

  const handleDeleteStudent = (studentId) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <UserListComponent
  users={students}
  onDeleteUser={handleDeleteStudent}
  addButtonLabel="Add Student"
  onAddOptionPress={() => navigation.navigate("AddSingleStudent")}
  onAddBatchPress={() => navigation.navigate("AddStudentBatch")}
  textColor={textColor} // Pass the textColor prop
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

export default AddStudentScreen;
