import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
  Button,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import baseURL from '../../config';
import {FlatList} from 'react-native-gesture-handler';

const ShareReference = ({route, navigation}) => {
  //   const {studentId} = route.params || {};
  //   console.log('StudentId: ', studentId);
  //const route = useRoute();
  const {course, studentId} = route.params;
  console.log('course and aaa StudentId: ', studentId, course);
  const {lessonPlanId} = route.params;
  console.log('lesson plan id: ', lessonPlanId, course);
  const [Students, setStudents] = [];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${baseURL}/Sharing/getStudents?studentId=${studentId}&courseCode=${courseCode}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks');
        }
        const data = await response.json();
        if (data.status === 'Success') {
          console.log('success');
        } else {
          console.log('not success');
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };
    fetchStudents();
  }, []);

  const shareReference = () => {
    fetch(`${baseURL}/Sharing/AddSharing`, {
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
          Alert.alert('Success', 'Reference Shared to Student successfully');
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
      {/* {loadingDepartments ? (
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
            setSelectedStudent(null); // Reset selected teacher when department changes
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
          placeholder="Select teacher"
          placeholderStyle={styles.placeholder}
          value={selectedStudent}
          onChange={item => {
            setSelectedStudent(item.value);
          }}
        />
      )} */}
      <FlatList data={Students} keyExtractor={item => item?.id?.toString()} />

      <TouchableOpacity style={styles.button} onPress={shareReference}>
        <Text style={styles.buttonText}>Share Reference</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShareReference;

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
