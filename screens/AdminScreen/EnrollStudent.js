import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const EnrollStudent = () => {
  const [semester, setSemester] = useState('');
  const [session, setSession] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Semester No"
        placeholderTextColor="#7E7E7E"
        value={semester}
        onChangeText={text => setSemester(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Session"
        placeholderTextColor="#7E7E7E"
        value={session}
        onChangeText={text => setSession(text)}
      />
      <DropDownPicker
        items={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
          { label: 'Option 4', value: 'option4' },
          { label: 'Option 5', value: 'option5' },
        ]}
        defaultValue={selectedOption}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdownItems}
        placeholder="Select an option..."
        onChangeItem={item => setSelectedOption(item.value)}
      />
      <TouchableOpacity style={styles.button}>
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
    color: "black",
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
  dropdownContainer: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItems: {
    backgroundColor: '#fafafa',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default EnrollStudent;
