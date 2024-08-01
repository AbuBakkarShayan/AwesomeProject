import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const StudentDepartmentScreen = ({route}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);
  const navigation = useNavigation();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);

  // Function to fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseURL}/department/alldepartment`);
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setServerDown(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setServerDown(true);
      }, 10000);

      fetchDepartments().then(() => clearTimeout(timeoutId));
    }, []),
  );

  const handleUpdateDepartment = departmentId => {
    // Handle update logic, navigate to update screen with departmentId
    navigation.navigate('UpdateDepartmentScreen', {
      departmentId,
      currentDepartmentName: departments.find(
        dep => dep.departmentId === departmentId,
      ).departmentName,
    });
  };

  const handleDeleteDepartment = async departmentId => {
    // Handle delete logic, send delete request to API
    try {
      const response = await fetch(
        `${baseURL}/department/deleteDepartment/${departmentId}`,
        {
          method: 'DELETE',
        },
      );
      const data = await response.json();
      if (data.status === 'Success') {
        // Remove deleted department from state
        setDepartments(
          departments.filter(
            department => department.departmentId !== departmentId,
          ),
        );
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  const renderDepartmentItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AddStudentScreen', {
          departmentId: item.departmentId,
        })
      }>
      <View style={styles.itemContainer}>
        <Text style={styles.departmentName}>{item.departmentName}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => handleUpdateDepartment(item.departmentId)}>
            <Icon name="create-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteDepartment(item.departmentId)}>
            <Icon name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  //logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (serverDown) {
    return (
      <View style={styles.serverDownContainer}>
        <Text style={styles.serverDownText}>Server Down</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={departments}
        renderItem={renderDepartmentItem}
        keyExtractor={item => item.departmentId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#5B5D8B',
    borderRadius: 8,
  },
  departmentName: {
    fontSize: 18,
    color: 'white',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  serverDownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serverDownText: {
    fontSize: 20,
    color: 'red',
  },
});

export default StudentDepartmentScreen;
