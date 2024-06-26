import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import baseURL from '../../config';

const EnrollStudent = ({ route, navigation }) => {
  const { courseCode } = route.params;
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [semesterNumber, setSemesterNumber] = useState('');
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    fetch(`${baseURL}/department/allDepartment`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.data)) {
          const formattedData = data.data.map(department => ({
            label: department.departmentName,
            value: department.departmentId,
          }));
          setDepartments(formattedData);
        } else {
          console.error('Error: Data is not an array', data);
        }
        setLoadingDepartments(false);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
        setLoadingDepartments(false);
      });
  };

  useEffect(() => {
    if (selectedDepartment) {
      fetchStudents(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchStudents = (departmentId) => {
    setLoadingStudents(true);
    fetch(`${baseURL}/student/getAllStudent?departmentId=${departmentId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.data)) {
          const formattedData = data.data.map(student => ({
            label: student.studentName,
            value: student.studentId,
          }));
          setStudents(formattedData);
        } else {
          console.error('Error: Data is not an array', data);
        }
        setLoadingStudents(false);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        setLoadingStudents(false);
      });
  };

  const enrollStudent = () => {
    if (!selectedStudent || !semesterNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const payload = {
      studentId: selectedStudent,
      smesterNo: semesterNumber,
      courseCode: [courseCode], // Wrap courseCode in an array
    };

    fetch(`${baseURL}/enrollment/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'Success') {
          Alert.alert('Success', 'Enrollment successful');
          navigation.goBack(); 
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => {
        console.error('Error enrolling student:', error);
        Alert.alert('Error', 'Failed to enroll student');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Semester Number"
        placeholderTextColor="#7E7E7E"
        value={semesterNumber}
        onChangeText={setSemesterNumber}
      />
      {loadingDepartments ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={departments}
          labelField="label"
          valueField="value"
          placeholder="Select Department"
          placeholderStyle={styles.placeholder}
          value={selectedDepartment}
          onChange={item => {
            setSelectedDepartment(item.value);
            setSelectedStudent(null); 
          }}
          
        />
      )}
      {loadingStudents ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={students}
          labelField="label"
          valueField="value"
          placeholder="Select Student"
          placeholderStyle={styles.placeholder}
          value={selectedStudent}
          onChange={item => {
            setSelectedStudent(item.value);
          }}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={enrollStudent}>
        <Text style={styles.buttonText}>Enroll</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EnrollStudent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    margin: 16,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    color:'black'
  },
  dropdown: {
    width: '80%',
    margin: 16,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    margin: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  placeholder:{
    color:"#7E7E7E"
  }
});
