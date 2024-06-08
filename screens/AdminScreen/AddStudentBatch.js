import { Alert, StyleSheet, TextInput, View, TouchableOpacity, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const AddStudentBatch = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

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
    setIsLoading(true);
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setFileData(jsonData);
      setIsLoading(false);
      registerStudents(jsonData);
    };
    fileReader.readAsBinaryString(file);
  };

  const registerStudents = async (students) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/user/registerusers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(students),
      });
      const responseData = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Data uploaded successfully!");
      } else {
        Alert.alert("Error", "Failed to upload data. " + responseData.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while uploading data. " + error.message);
    }
    setIsLoading(false);
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
      {isLoading && <ActivityIndicator size="large" color="#5B5D8B" />}
      {fileData && (
        <FlatList
          data={fileData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.name}</Text>
              {/* Render other details here */}
            </View>
          )}
        />
      )}
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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default AddStudentBatch;
