import { Alert, StyleSheet, TextInput, View, Button, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import LogoutButton from './customcomponent/logoutComponent';

const AddStudentBatch = ({ navigation }) => {
  // Logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const [selectedFile, setSelectedFile] = useState("");
  const [fileData, setFileData] = useState(null);

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
      });
      setSelectedFile(doc.name);
      processFile(doc);
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log("User canceled the upload", err);
      else
        console.log(err);
    }
  };

  const processFile = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setFileData(jsonData);
    };
    fileReader.readAsBinaryString(file);
  };

  const uploadData = async () => {
    if (!fileData) {
      Alert.alert("No file selected", "Please select a file first.");
      return;
    }
    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students: fileData }),
      });
      if (response.ok) {
        Alert.alert("Success", "Data uploaded successfully!");
      } else {
        Alert.alert("Error", "Failed to upload data.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while uploading data.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={selectedFile}
        placeholder="Upload Excel File"
        placeholderTextColor="#7E7E7E"
        editable={false}
      />
      <TouchableOpacity style={styles.button} onPress={selectDoc}>
        <Text style={styles.buttonText}>Upload Batch File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={uploadData}>
        <Text style={styles.buttonText}>Submit Data</Text>
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
});

export default AddStudentBatch;
