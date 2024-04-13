import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Picker} from 'react-native';


const EnrollStudent = () => {
    const DropdownExample = () => {
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
      <Picker selectedValue={selectedValue}
      style={styles.input}
      onValueChange={(itemValue, itemIndex)=>setSelectedValue(itemValue)}>
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
        <Picker.Item label="Option 4" value="option4" />
        <Picker.Item label="Option 5" value="option5" />
      </Picker>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Enroll User</Text>
      </TouchableOpacity>
    </View>
  );
};
}
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
});

export default EnrollStudent