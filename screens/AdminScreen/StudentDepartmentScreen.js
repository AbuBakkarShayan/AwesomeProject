import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Department context to manage state and provide update function
const DepartmentContext = createContext();

const StudentDepartmentScreen = () => {
  const navigation = useNavigation();
  const [departments, setDepartments] = useState([]);

  // Function to fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://192.168.42.184/FYPAPI/api/department/alldepartment');
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
    <TouchableOpacity onPress={() => navigation.navigate('AddStudentScreen', { departmentId: item.departmentId })}>
      <View style={styles.itemContainer}>
        <Text style={styles.departmentName}>{item.departmentName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <DepartmentContext.Provider value={{ departments, setDepartments }}>
        <FlatList
          data={departments}
          renderItem={renderDepartmentItem}
          keyExtractor={(item) => item.departmentId.toString()}
        />
      </DepartmentContext.Provider>
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
    color: 'white',
    textAlign: 'center',
  },
});

export default StudentDepartmentScreen;

// Outside the component, create a custom hook to access department context
export const useDepartmentContext = () => useContext(DepartmentContext);
