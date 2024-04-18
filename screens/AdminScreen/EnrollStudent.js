import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';


const EnrollStudent = () => {
    
        const [selectedValue, setSelectedValue] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Semester No"
        placeholderTextColor={"#7E7E7E"}
      />
      <TextInput
        style={styles.input}
        placeholder="Session"
        placeholderTextColor={"#7E7E7E"}
      />
      <RNPickerSelect selectedValue={selectedValue}
       placeholder={{ label: 'Select an option...', value: null }}
        onValueChange={(value) => setSelectedValue(value)}
      
      items={[
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
        { label: 'Option 4', value: 'option4' },
        { label: 'Option 5', value: 'option5' },
      ]}
      style={pickerSelectStyles}
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
    //justifyContent: 'center',
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
    color:"black",
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
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    width: 200,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    width: 200,
  },
});

export default EnrollStudent