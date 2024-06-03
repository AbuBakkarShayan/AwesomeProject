import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const EnrollStudent = ({ navigation }) => {
  // logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const [semester, setSemester] = useState('');
  const [session, setSession] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

  
  useEffect(() => {
  const fetchStudentList = async () => {
    try {
      setLoading(true); // Set loading to true while fetching
      const response = await fetch(`${baseURL}/Student/getAllStudent`);
      if (!response.ok) {
        throw new Error(`Failed to fetch student list: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setStudentList(data);
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error('Error fetching student list:', error);
      setError(error.message); // Set error message
      setLoading(false); // Set loading to false in case of error
    }
  };

  fetchStudentList();
}, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

  const enrollStudent = () => {
    // Implement your logic for enrolling the selected student
    console.log('Enrolling student:', selectedStudent);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Semester No"
        placeholderTextColor="#7E7E7E"
        value={semester}
        onChangeText={(text) => setSemester(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Session"
        placeholderTextColor="#7E7E7E"
        value={session}
        onChangeText={(text) => setSession(text)}
      />
      <SelectList
  setSelected={(val) => setSelectedStudent(val)}
  data={studentList && studentList.map((student) => ({ key: student.id, value: student.name }))}
  save="value"
  dropdownTextStyles={{ color: 'black' }}
  placeholder="Select a student"
  inputStyles={{ color: 'black' }}
  boxStyles={{ marginBottom: 15, width: 383 }}
  dropdownStyles={{ marginBottom: 20 }}
/>
      <TouchableOpacity style={styles.button} onPress={enrollStudent}>
        <Text style={styles.buttonText}>Enroll User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color: 'black',
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EnrollStudent;
