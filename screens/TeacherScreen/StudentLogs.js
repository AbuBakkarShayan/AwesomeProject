import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import baseURL from '../../config';

const headers = {
  'Content-Type': 'application/json',
  // Add other headers as needed
};

const StudentLogs = () => {
  const route = useRoute();
  const {studentId, regNo} = route.params;
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLogs = async () => {
      const url = `${baseURL}/Logs/getLogs?studentId=${studentId}&type=Book`;
      console.log(`Requesting URL: ${url}`); // Log the URL
      try {
        const response = await fetch(url, {headers});
        console.log(`Response status: ${response.status}`); // Log response status
        if (response.status === 200) {
          const responseBody = await response.json();
          console.log(`Response body: ${JSON.stringify(responseBody)}`); // Log response body
          if (responseBody.status === 'Success') {
            setLogs(responseBody.data);
          } else {
            setMessage(responseBody.message);
          }
        } else {
          setMessage(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error(`Fetch error: ${error}`); // Log fetch error
        setMessage('Server Down');
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, [studentId]);

  const renderItem = ({item}) => <LogsTile logs={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.title}>{regNo} </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : logs.length === 0 ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const LogsTile = ({logs}) => (
  <View style={styles.logsTileContainer}>
    <View style={styles.bookContainer}>
      <Text style={styles.bookTitle}>Book</Text>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.boldText}>Start Time</Text>
        <Text>{logs.startTime}</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.boldText}>End Time</Text>
        <Text>{logs.endTime}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Replace with your backgroundColor constant
  },
  appBar: {
    //height: 56,
    margin: 10,
    backgroundColor: '#ccc',

    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    color: '#5B5D8D',
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
  logsTileContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
  },
  bookContainer: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  bookTitle: {
    fontSize: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  column: {
    alignItems: 'center',
    marginHorizontal: 25,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default StudentLogs;
