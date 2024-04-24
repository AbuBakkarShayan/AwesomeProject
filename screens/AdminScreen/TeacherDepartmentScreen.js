//import config from '../../config';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import baseURL from '../../config';

const TeacherDepartmentScreen = () => {
  const [departments, setDepartments] = useState([]);

  //Variable for API URL
  const loginEndPoint =  '/department/alldepartment';
  //const fullUrl= config.baseURL+loginEndPoint;

  // Function to fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseURL+loginEndPoint}`);
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch departments when component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Render individual department item
  const renderDepartmentItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.departmentName}>{item.departmentName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>      
      <FlatList
        data={departments}
        renderItem={renderDepartmentItem}
        keyExtractor={(item) => item.departmentId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#5B5D8B',
    borderRadius: 8,
    
  },
  departmentName: {
    fontSize: 16,
    color:"white",
    textAlign:"center"
  },
});

export default TeacherDepartmentScreen;

//<Button title="Refresh Departments" onPress={fetchDepartments} />