import { Alert, StyleSheet, TextInput, View, Button,TouchableOpacity ,Text } from 'react-native';
import React from 'react';
import { useState,useEffect } from 'react';
import DocumentPicker from 'react-native-document-picker';

const AddStudentBatch = () => {

  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
  a
  }, [selectedFile]);

const selectDoc= async ()=>{
  try{
const doc = await DocumentPicker.pickSingle({
  type:[DocumentPicker.types.xls],
});
setSelectedFile(doc.name);
  }
  catch(err){
if(DocumentPicker.isCancel(err))
console.log("User cancel the Upoad", err)
else
console.log(err);
  }
}
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={selectedFile}
        placeholder="Upload Excel File"
        placeholderTextColor="#7E7E7E"
        editable={false}
      />

       <TouchableOpacity style={styles.button} onPress={selectDoc}><Text style={styles.buttonText}>Upload Batch File</Text></TouchableOpacity>

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
    color:"#7E7E7E"
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

export default AddStudentBatch;