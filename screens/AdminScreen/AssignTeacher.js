import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import LogoutButton from './customcomponent/logoutComponent';
import DropDownPicker from 'react-native-dropdown-picker';

const AssignTeacher = ({navigation}) => {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={styles.container}>
      
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
        placeholder="Department"
        onChangeItem={item => setSelectedOption(item.value)}
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
        placeholder="Teachers"
        onChangeItem={item => setSelectedOption(item.value)}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Assign</Text>
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

export default AssignTeacher;
