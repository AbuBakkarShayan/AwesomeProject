import { Alert, StyleSheet, TextInput, View, Button } from 'react-native';
import React from 'react';
import FilePickerManager from 'react-native-file-picker';
import { request, PERMISSIONS } from 'react-native-permissions';

const AddStudentBatch = () => {
  const [filePath, setFilePath] = React.useState("");

  const handlePickFile = async () => {
    const permissionResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (permissionResult !== 'granted') {
      Alert.alert("Permission Required", "Please grant permission to access files");
      return;
    }
    FilePickerManager.showFilePicker(null, async (response) => {
      if (response.didCancel) {
        Alert.alert("User Canceled File Picker");
      } else if (response.error) {
        console.log("Error", response.error);
        Alert.alert("An error occurred while picking the file");
      } else {
        setFilePath(response.path);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={filePath}
        placeholder="Upload Excel File"
        placeholderTextColor="#7E7E7E"
        editable={false}
      />
      <Button title="Upload Excel File" onPress={handlePickFile} />
      {/* <TouchableOpacity style={styles.button} ><Text style={styles.buttonText}>Add Batch</Text></TouchableOpacity> */}
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