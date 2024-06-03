import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import baseURL from '../../config';

const CourseMaterial = () => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments from API
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

  // Fetch teachers for selected department
  useEffect(() => {
    if (selectedDepartment) {
      fetchTeachers(selectedDepartment);
    }
  }, [selectedDepartment]);

  // Fetch teachers from API for the selected department
  const fetchTeachers = (departmentId) => {
    setLoadingTeachers(true);
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


  

  return (
    <View>
      {loadingDepartments ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={departments}
          labelField="label"
          valueField="value"
          itemTextStyle={styles.itemText}
          selectedTextStyle={{color:'black'}}
          placeholder="Select department"
          placeholderStyle={styles.placeholder}
          value={selectedDepartment}
          onChange={item => {
            setSelectedDepartment(item.value);
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
          selectedTextStyle={{color:'black'}}
          itemTextStyle={styles.itemText}
          placeholder="Select teacher"
          placeholderStyle={styles.placeholder}
          value={null}
          onChange={item => {
            // Handle teacher selection if needed
          }}
        />

        
      )}
      <TouchableOpacity style={styles.button} onPress={assignCourseToTeacher}>
        <Text style={styles.buttonText}>Assign</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CourseMaterial;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    color:"black"
  },
  placeholder:{
    color:'black'
  },
  itemText:{
    color:'black'
  }
});
