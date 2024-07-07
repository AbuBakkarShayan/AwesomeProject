import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text, Alert, TextInput, FlatList } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
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
  const [session, setSession] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loadingEnrolledStudents, setLoadingEnrolledStudents] = useState(true);

  useEffect(() => {
    fetchDepartments();
    calculateSession();
  }, []);

  useEffect(() => {
    if (session) {
      fetchEnrolledStudents();
    }
  }, [session]);

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

  const calculateSession = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const semester = getSemester(month);
    setSession(`${semester} ${year}`);
  };

  const getSemester = (month) => {
    if (month >= 1 && month <= 6) {
      return "Spring";
    } else {
      return "Fall";
    }
  };

  const fetchEnrolledStudents = () => {
    const [semester, year] = session.split(' ');
    let month;
    if (semester === 'Spring') {
      month = 1;
    } else {
      month = 7;
    }

    fetch(`${baseURL}/enrollment/getEnrolledStudents?courseCode=${courseCode}&year=${year}&month=${month}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.data)) {
          const formattedData = data.data.map(student => ({
            studentId: student.studentId,
            studentName: student.studentName,
          }));
          setEnrolledStudents(formattedData);
        } else {
          console.error('Error: Data is not an array', data);
        }
        setLoadingEnrolledStudents(false);
      })
      .catch(error => {
        console.error('Error fetching enrolled students:', error);
        setLoadingEnrolledStudents(false);
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
    if (!selectedStudent || !semesterNumber || !session) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const [semester, year] = session.split(' ');

    let month;
    if (semester === 'Spring') {
      month = 1;
    } else {
      month = 7;
    }

    const payload = {
      studentId: selectedStudent,
      smesterNo: semesterNumber,
      courseCode: [courseCode],
      enrollmentSession: session,
      year: parseInt(year, 10),
      month: month,
    };

    console.log('Enrollment Payload:', payload);

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
        console.log('API Response:', data);
        if (data.status === 'Success') {
          Alert.alert('Success', 'Enrollment successful');
          setEnrolledStudents(prevEnrolledStudents => [
            ...prevEnrolledStudents,
            {
              studentId: selectedStudent,
              studentName: students.find(student => student.value === selectedStudent).label,
            },
          ]);
          setSelectedStudent(null); // Clear selected student
          setSemesterNumber(''); // Clear semester number
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => {
        console.error('Error enrolling student:', error);
        Alert.alert('Error', 'Failed to enroll student');
      });
  };

  const removeEnrollment = (studentId) => {
    const [semester, year] = session.split(' ');
    let month;
    if (semester === 'Spring') {
      month = 1;
    } else {
      month = 7;
    }

    fetch(`${baseURL}/enrollment/removeEnrollment?studentId=${studentId}&year=${year}&month=${month}&courseCode=${courseCode}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'Success') {
          Alert.alert('Success', 'Enrollment removed');
          setEnrolledStudents(prevEnrolledStudents =>
            prevEnrolledStudents.filter(student => student.studentId !== studentId)
          );
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => {
        console.error('Error removing enrollment:', error);
        Alert.alert('Error', 'Failed to remove enrollment');
      });
  };

  const renderEnrolledStudentItem = ({ item }) => (
    <View style={styles.enrolledStudentItem}>
      <Text style={styles.enrolledStudentName}>{item.studentName}</Text>
      <TouchableOpacity onPress={() => removeEnrollment(item.studentId)}>
        <Icon name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sessionText}>{session}</Text>
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
          onChange={item => setSelectedStudent(item.value)}
        />
      )}
      <TouchableOpacity style={styles.enrollButton} onPress={enrollStudent}>
        <Text style={styles.enrollButtonText}>Enroll</Text>
      </TouchableOpacity>
      {loadingEnrolledStudents ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={enrolledStudents}
          keyExtractor={(item) => item.studentId.toString()}
          renderItem={renderEnrolledStudentItem}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No students enrolled</Text>}
          contentContainerStyle={styles.enrolledStudentsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  sessionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    color: 'black',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    color: 'black',
  },
  placeholder: {
    color: '#7E7E7E',
  },
  enrollButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  enrolledStudentsList: {
    marginTop: 20,
  },
  enrolledStudentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  enrolledStudentName: {
    fontSize: 16,
    color:"black",
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default EnrollStudent;
