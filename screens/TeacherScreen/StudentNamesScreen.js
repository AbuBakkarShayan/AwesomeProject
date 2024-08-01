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

const StudentNamesScreen = ({route}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const {smesterNumber} = route.params;
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const getStudents = async () => {
      const url = `${baseURL}/Logs/getStudents?smesterNo=${smesterNumber}`;
      try {
        const response = await fetch(url, {headers});
        if (response.status === 200) {
          const responseBody = await response.json();
          if (responseBody.status === 'Success') {
            const uniqueStudents = responseBody.data.filter(
              (student, index, self) =>
                index ===
                self.findIndex(s => s.studentId === student.studentId),
            );
            setStudents(uniqueStudents);
          } else {
            setMessage(responseBody.message);
          }
        } else {
          setMessage(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
        setMessage('Server Down');
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [smesterNumber]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('StudentLogs', {
          studentId: item.studentId,
          regNo: item.studentRegNo,
        })
      }>
      <View style={styles.itemContent}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.studentName}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.studentRegNo}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : students.length === 0 ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={item => item.studentId.toString()}
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    color: '#000000',
    width: 180,
  },
  itemSubtitle: {
    fontSize: 16,
    color: '#000000',
    width: 180,
    marginTop: 3,
  },
});

export default StudentNamesScreen;

//==========================================
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import baseURL from '../../config';

// const headers = {
//   'Content-Type': 'application/json',
//   // Add other headers as needed
// };

// const StudentNamesScreen = ({route}) => {
//   const {smesterNumber} = route.params;
//   const [students, setStudents] = useState([]);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const getStudents = async () => {
//       const url = `${baseURL}/Logs/getStudents?smesterNo=${smesterNumber}`;
//       console.log(`Requesting URL: ${url}`); // Log the URL
//       try {
//         const response = await fetch(url, {headers});
//         console.log(`Response status: ${response.status}`); // Log response status
//         if (response.status === 200) {
//           const responseBody = await response.json();
//           console.log(`Response body: ${JSON.stringify(responseBody)}`); // Log response body
//           if (responseBody.status === 'Success') {
//             setStudents(responseBody.data);
//           } else {
//             setMessage(responseBody.message);
//           }
//         } else {
//           setMessage(`Error: ${response.status}`);
//         }
//       } catch (error) {
//         console.error(`Fetch error: ${error}`); // Log fetch error
//         setMessage('Server Down');
//       } finally {
//         setLoading(false);
//       }
//     };

//     getStudents();
//   }, [smesterNumber]);

//   const renderItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.itemContainer}
//       onPress={() =>
//         navigation.navigate('StudentLogs', {
//           studentId: item.studentId,
//           regNo: item.studentRegNo,
//         })
//       }>
//       <View style={styles.itemContent}>
//         <View style={styles.itemTextContainer}>
//           <Text style={styles.itemTitle} numberOfLines={1}>
//             {item.studentName}
//           </Text>
//           <Text style={styles.itemSubtitle} numberOfLines={1}>
//             {item.studentRegNo}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
//       ) : students.length === 0 ? (
//         <Text style={styles.message}>{message}</Text>
//       ) : (
//         <FlatList
//           data={students}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => item.studentId.toString() + index} // Ensure unique keys
//           contentContainerStyle={styles.list}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5', // Replace with your backgroundColor constant
//   },
//   title: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   message: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     fontSize: 18,
//     color: 'red',
//   },
//   list: {
//     padding: 10,
//   },
//   itemContainer: {
//     marginVertical: 7.5,
//     marginHorizontal: 10,
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 15,
//   },
//   itemContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   itemTextContainer: {
//     flex: 1,
//   },
//   itemTitle: {
//     fontSize: 20,
//     color: '#000000',
//     width: 180,
//   },
//   itemSubtitle: {
//     fontSize: 16,
//     color: '#000000',
//     width: 180,
//     marginTop: 3,
//   },
// });

// export default StudentNamesScreen;
