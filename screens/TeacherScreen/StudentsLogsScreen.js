import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import baseURL from '../../config';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const headers = {
  'Content-Type': 'application/json',
  // Add other headers as needed
};

const StudentLogsScreen = ({route}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const {teacherId} = route.params;
  const [smesterNumbers, setSmesterNumbers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const getSemesterNumbers = async () => {
      const url = `${baseURL}/Logs/getSmesterNumbers?teacherId=${teacherId}`;
      try {
        const response = await fetch(url, {headers});
        if (response.status === 200) {
          const responseBody = await response.json();
          if (responseBody.status === 'Success') {
            setSmesterNumbers(responseBody.data);
          } else {
            setMessage(responseBody.message);
          }
        } else {
          setMessage(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getSemesterNumbers();
  }, [teacherId]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('StudentNamesScreen', {smesterNumber: item})
      }>
      <Text style={styles.itemText}>Semester {item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.appBar}>
        <Text style={styles.title}>Student Logs</Text>
      </View> */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : smesterNumbers.length === 0 ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <FlatList
          data={smesterNumbers}
          renderItem={renderItem}
          keyExtractor={item => item.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Replace with your backgroundColor constant
  },
  appBar: {
    height: 56,
    backgroundColor: '#6200EE', // Replace with your desired color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: 'red',
  },
  list: {
    padding: 10,
  },
  itemContainer: {
    marginVertical: 7.5,
    marginHorizontal: 10,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  itemText: {
    fontSize: 20,
    color: '#000000',
    width: 200,
    overflow: 'hidden',
  },
});

export default StudentLogsScreen;
