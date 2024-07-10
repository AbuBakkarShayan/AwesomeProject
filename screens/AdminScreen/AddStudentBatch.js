import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import baseURL from '../../config';

const AddMultipleUsers = () => {
  const [file, setFile] = useState('No File Selected');
  const [filePath, setFilePath] = useState(null);
  const [users, setUsers] = useState([]);

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(res[0].name);
      setFilePath(res[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Failed to select file');
      }
    }
  };

  const readExcelFile = async filePath => {
    try {
      const fileUri = filePath.replace('file://', '');
      const data = await RNFS.readFile(fileUri, 'base64');
      const workbook = XLSX.read(data, {type: 'base64'});

      const sheetName = workbook.SheetNames[2]; // Assuming data is in the third sheet
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const parsedUsers = json.map(row => ({
        username: row['username']?.toString(),
        password: row['password']?.toString(),
        role: row['role']?.toString(),
        department: row['department']?.toString(),
        name: row['name']?.toString(),
        phoneNo: row['phoneNo']?.toString(),
      }));
      setUsers(parsedUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to read file');
    }
  };

  const addUsers = async () => {
    const url = `${baseURL}/user/RegisterUsers`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(users),
      });

      const responseBody = await response.json();

      const updatedUsers = users.map(user => {
        const responseItem = responseBody.find(
          item => item.username === user.username,
        );
        if (responseItem) {
          return {
            ...user,
            status: responseItem.status,
            message: responseItem.message,
          };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to add users');
    }
  };

  const clearRegisteredUsers = () => {
    const filteredUsers = users.filter(user => user.status !== 'Success');
    setUsers(filteredUsers);
  };

  const editUser = index => {
    // Implement user edit functionality
    // You might show a dialog or navigate to another screen to edit the user details
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button title="Select File" onPress={selectFile} color={'#5D5B8D'} />
        <Text style={styles.fileText}>{file}</Text>
        <Button
          color={'#5D5B8D'}
          title="Load Data"
          onPress={() => {
            if (!filePath) {
              Alert.alert('Error', 'Select File First');
            } else {
              readExcelFile(filePath);
            }
          }}
        />
      </View>
      <View style={styles.userListContainer}>
        <View style={styles.row}>
          <Button
            title="Clear"
            onPress={clearRegisteredUsers}
            color={'#5D5B8D'}
          />
          <Button
            title="Clear All"
            onPress={() => setUsers([])}
            color={'#5D5B8D'}
          />
        </View>
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={styles.userTile}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userName}>{item.username}</Text>
                {item.status && item.message && (
                  <>
                    <Text
                      style={{
                        color: item.status === 'Success' ? '#5D5B8D' : 'red',
                      }}>
                      {item.status}
                    </Text>
                    <Text
                      style={{
                        color: item.status === 'Success' ? '#5D5B8D' : 'red',
                      }}>
                      {item.message}
                    </Text>
                  </>
                )}
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity onPress={() => editUser(index)}>
                  <Text style={styles.action}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const newUsers = users.filter((_, i) => i !== index);
                    setUsers(newUsers);
                  }}>
                  <Text style={styles.action}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <Button title="Add Users" onPress={addUsers} color={'#5D5B8D'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fileText: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  userListContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 8,
  },
  userTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  userInfo: {
    flex: 1,
  },
  action: {
    color: 'black',
  },
  userName: {
    fontSize: 18,
    color: 'black',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 80,
  },
});

export default AddMultipleUsers;
