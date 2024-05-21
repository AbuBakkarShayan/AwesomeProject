import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import LogoutButton from './customcomponent/logoutComponent';

const EnrollStudent = ({navigation}) => {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  const [semester, setSemester] = useState('');
  const [session, setSession] = useState('');
  const [selected, setSelected] = React.useState("");

  const data = [
    {key:'1', value:'No option'},
    {key:'2', value:'Shayan'},
    {key:'3', value:'Hani'},
    {key:'4', value:'Sapna'},
    {key:'5', value:'Mehran'},
    {key:'6', value:'Maddy'},
    {key:'7', value:'Umair'},
]
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
      <SelectList 
        setSelected={(val) => setSelected(val)} 
        data={data} 
        save="value"
        // onSelect={() => alert(selected)}
        dropdownTextStyles={{color:"black"}}
        placeholder='Select an option'
        inputStyles={{ color:'black'}}
        boxStyles={{marginBottom:15,width:383}}
        dropdownStyles={{marginBottom:20}}
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
