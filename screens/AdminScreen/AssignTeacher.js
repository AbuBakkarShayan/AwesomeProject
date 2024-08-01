import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import baseURL from '../../config';
import LogoutButton from './customcomponent/logoutComponent';

const AssignTeacher = ({route, navigation}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);
  const {courseCode} = route.params;
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

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
      fetchTeachers(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchTeachers = departmentId => {
    setLoadingTeachers(true);
    //fetch(`${baseURL}/teacher/allTeacher?departmentId=${departmentId}`)
    fetch(`${baseURL}/teacher/getAllTeacher?departmentId=${departmentId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.data)) {
          const formattedData = data.data.map(teacher => ({
            label: teacher.teacherName,
            value: teacher.teacherId,
          }));
          setTeachers(formattedData);
        } else {
          console.error('Error: Data is not an array', data);
        }
        setLoadingTeachers(false);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
        setLoadingTeachers(false);
      });
  };

  const assignCourseToTeacher = () => {
    if (!selectedTeacher) {
      Alert.alert('Error', 'Please select a teacher');
      return;
    }

    const payload = {
      teacherId: selectedTeacher,
      courseCode: courseCode, // Use courseCode instead of courseId
    };

    fetch(`${baseURL}/course/courseAssign`, {
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
          Alert.alert('Success', 'Course assigned to teacher successfully');
          navigation.goBack(); // Navigate back after successful assignment
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => {
        console.error('Error assigning course:', error);
        Alert.alert('Error', 'Failed to assign course');
      });
  };

  return (
    <View style={styles.container}>
      {loadingDepartments ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={departments}
          labelField="label"
          valueField="value"
          placeholder="Select department"
          placeholderStyle={styles.placeholder}
          value={selectedDepartment}
          onChange={item => {
            setSelectedDepartment(item.value);
            setSelectedTeacher(null); // Reset selected teacher when department changes
          }}
        />
      )}

      {loadingTeachers ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={teachers}
          labelField="label"
          valueField="value"
          placeholder="Select teacher"
          placeholderStyle={styles.placeholder}
          value={selectedTeacher}
          onChange={item => {
            setSelectedTeacher(item.value);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={assignCourseToTeacher}>
        <Text style={styles.buttonText}>Assign</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AssignTeacher;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: '80%',
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
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
  placeholder: {
    color: '#7E7E7E',
  },
});
