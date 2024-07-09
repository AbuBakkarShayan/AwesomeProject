import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import baseURL from '../../config';

const headers = {
  'Content-Type': 'application/json',
};

const EnrollMultipleStudents = () => {
  const [file, setFile] = useState('No File Selected');
  const [filePath, setFilePath] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const enrollStudents = async () => {
    const url = `${baseURL}/enrollment/multipleEnroll`;
    try {
      const usersJson = enrollments.map(e => ({
        regNo: e.regNo,
        name: e.name,
        courseCode: e.courseCode,
        smesterNo: e.smesterNo,
      }));
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(usersJson),
      });

      const responseBody = await response.json();

      const updatedEnrollments = enrollments.map(user => {
        const responseItem = responseBody.find(
          item => item.regNo === user.regNo,
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

      setEnrollments(updatedEnrollments);
    } catch (e) {
      console.error(e);
    }
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });
      console.log('DocumentPicker result:', res);
      setFile(res[0].name);
      setFilePath(res[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  const readExcelFile = async path => {
    setEnrollments([]);
    try {
      console.log('Reading file from URI:', path);

      const readFile = await RNFS.readFile(path, 'base64');
      const workbook = XLSX.read(readFile, {type: 'base64'});

      const sheetName = workbook.SheetNames[3]; // Assuming data is in the third sheet
      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
      const headers = json[0].map(header => header.toString().toLowerCase());
      const requiredHeaders = ['name', 'regno', 'smester', 'courses'];

      const missingHeaders = requiredHeaders.filter(
        header => !headers.includes(header),
      );
      if (missingHeaders.length > 0) {
        console.error(`Missing headers: ${missingHeaders.join(', ')}`);
        return;
      }

      const headerIndexes = requiredHeaders.reduce((acc, header) => {
        acc[header] = headers.indexOf(header);
        return acc;
      }, {});

      const enrollmentsData = json.slice(1).map(row => ({
        regNo: row[headerIndexes['regno']],
        name: row[headerIndexes['name']],
        courseCode: row[headerIndexes['courses']],
        smesterNo: row[headerIndexes['smester']],
        toJson() {
          return {
            regNo: this.regNo,
            name: this.name,
            courseCode: this.courseCode,
            smesterNo: this.smesterNo,
          };
        },
      }));

      setEnrollments(enrollmentsData);
    } catch (e) {
      console.error('Error reading excel file:', e);
    }
  };

  const editUser = index => {
    setSelectedEnrollment(enrollments[index]);
  };

  const clearEnrolledStudent = () => {
    setEnrollments(enrollments.filter(user => user.status !== 'Success'));
  };

  const showSnackBar = message => {
    Alert.alert(message);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.row}>
        <Button title="Select File" onPress={selectFile} />
        <Text style={styles.fileName}>{file}</Text>
        <Button
          title="Load Data"
          onPress={() => {
            if (!filePath) {
              showSnackBar('Select File First');
            } else {
              readExcelFile(filePath);
            }
          }}
        />
      </View>
      <View style={styles.row}>
        <Button title="Clear" onPress={clearEnrolledStudent} />
        <Button
          title="Clear All"
          onPress={() => {
            setEnrollments([]);
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={enrollments}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={({item, index}) => (
          <BulkEnrollmentTile
            enrollment={item}
            onEdit={() => editUser(index)}
            onDelete={() => {
              setEnrollments(enrollments.filter((_, i) => i !== index));
            }}
          />
        )}
      />
      <Button title="Enroll Students" onPress={enrollStudents} />
      {selectedEnrollment && (
        <EditEnrollmentDialog
          enrollment={selectedEnrollment}
          onConfirm={updatedEnrollment => {
            setEnrollments(
              enrollments.map(e =>
                e.regNo === updatedEnrollment.regNo ? updatedEnrollment : e,
              ),
            );
            setSelectedEnrollment(null);
          }}
          onCancel={() => setSelectedEnrollment(null)}
        />
      )}
    </View>
  );
};

const BulkEnrollmentTile = ({enrollment, onEdit, onDelete}) => {
  return (
    <View style={styles.tile}>
      <View style={styles.tileRow}>
        <View>
          <Text style={styles.name}>{enrollment.name}</Text>
          <Text>{enrollment.regNo}</Text>
        </View>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
      {enrollment.status && enrollment.message && (
        <View>
          <Text
            style={
              enrollment.status === 'Success' ? styles.success : styles.error
            }>
            {enrollment.status}
          </Text>
          <Text
            style={
              enrollment.status === 'Success' ? styles.success : styles.error
            }>
            {enrollment.message}
          </Text>
        </View>
      )}
    </View>
  );
};

const EditEnrollmentDialog = ({enrollment, onConfirm, onCancel}) => {
  const [regNo, setRegNo] = useState(enrollment.regNo);
  const [courseCode, setCourseCode] = useState(enrollment.courseCode);

  return (
    <View style={styles.dialog}>
      <Text style={styles.dialogTitle}>Edit User</Text>
      <TextInput
        style={styles.input}
        value={regNo}
        onChangeText={setRegNo}
        placeholder="RegNo"
      />
      <TextInput
        style={styles.input}
        value={courseCode}
        onChangeText={setCourseCode}
        placeholder="Courses"
      />
      <View style={styles.dialogButtons}>
        <Button title="Cancel" onPress={onCancel} />
        <Button
          title="Save"
          onPress={() => {
            onConfirm({...enrollment, regNo, courseCode});
            onCancel();
          }}
        />
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fileName: {
    flex: 1,
    textAlign: 'center',
  },
  tile: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
  },
  editButton: {
    color: 'blue',
  },
  deleteButton: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  dialog: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
  },
  dialogTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EnrollMultipleStudents;
