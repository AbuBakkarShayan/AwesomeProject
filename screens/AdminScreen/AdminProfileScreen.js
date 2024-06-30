// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/core';

// const AdminProfileScreen = () => {
//   const navigation = useNavigation();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const initialize = async () => {
//       await checkIfLoggedIn();
//       await fetchData();
//       setIsLoading(false);
//     };
//     initialize();
//   }, []);

//   const checkIfLoggedIn = async () => {
//     const userToken = await AsyncStorage.getItem('userToken');
//     if (!userToken) {
//       await AsyncStorage.removeItem('lastScreen');
//       await AsyncStorage.removeItem('userRole');
//       //navigation.navigate('LoginScreen1');
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const storedUsername = await AsyncStorage.getItem('username');
//       const storedPassword = await AsyncStorage.getItem('password');
//       console.log('Stored Username:', storedUsername);
//       console.log('Stored Password:', storedPassword);
//       if (storedUsername !== null && storedPassword !== null) {
//         setUsername(storedUsername);
//         setPassword(storedPassword);
//       }
//     } catch (error) {
//       console.log('Error retrieving data:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('username');
//       await AsyncStorage.removeItem('password');
//       await AsyncStorage.removeItem('userToken'); // Ensure userToken is removed as well
//       const removedUsername = await AsyncStorage.getItem('username');
//       const removedToken = await AsyncStorage.getItem('userToken');

//       // Check if the username and userToken were successfully removed from AsyncStorage
//       if (removedUsername === null && removedToken === null) {
//         console.log('Username and userToken are successfully removed from AsyncStorage');
//         navigation.navigate('LoginScreen1');
//       } else {
//         console.log('Failed to remove username or userToken from AsyncStorage');
//       }
//     } catch (error) {
//       console.log('Error clearing AsyncStorage:', error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Username:</Text>
//       <Text style={styles.value}>{username}</Text>
//       <Text style={styles.label}>Password:</Text>
//       <Text style={styles.value}>{password}</Text>
//       <TouchableOpacity onPress={handleLogout} style={styles.buttonStyle}>
//         <Text style={styles.buttonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333', // dark gray
//   },
//   value: {
//     fontSize: 16,
//     marginBottom: 15,
//     color: 'black', // medium gray
//   },
//   buttonText: {
//     color: '#fff', // white
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonStyle: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 45,
//     marginTop: 20,
//     backgroundColor: "#5B5D8B"
//   }
// });

// export default AdminProfileScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../config';

const AdminProfileScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserDetails = async () => {
      const storedName = await AsyncStorage.getItem('name');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPhoneNo = await AsyncStorage.getItem('phoneNo');
      const storedPassword = await AsyncStorage.getItem('password');
      if (storedName) setName(storedName);
      if (storedUsername) setUsername(storedUsername);
      if (storedPhoneNo) setPhoneNo(storedPhoneNo);
      if (storedPassword) setPassword(storedPassword);
    };
    getUserDetails();
  }, []);

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleUpdatePassword = () => {
    Alert.alert(
      'Update Password',
      'If you update the password, you must log out. Do you want to proceed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await fetch(`${baseURL}/user/updatePassword`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
              });
              const result = await response.json();
              if (result.status === 'Success') {
                await AsyncStorage.clear();
                navigation.navigate('LoginScreen1');
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while updating the password.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.clear();
            
            navigation.navigate('LoginScreen1');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Icon name="person" size={24} color={"#7E7E7E"} />
        <Text style={styles.label}>Name: </Text>
        <Text style={styles.value}>Abu Bakkar Shayan</Text>
      </View>

      <View style={styles.itemContainer}>
        <Icon name="mail" size={24} color={"#7E7E7E"} />
        <Text style={styles.label}>UserName:</Text>
        <Text style={styles.value}>{username}</Text>
      </View>

      <View style={styles.itemContainer}>
        <Icon name="call" size={24} color={"#7E7E7E"} />
        <Text style={styles.label}>Phone No:</Text>
        <Text style={styles.value}>+923345472394</Text>
      </View>

      <View style={styles.itemContainer}>
        <Icon name="lock-closed" size={24} color={"#7E7E7E"} />
        <Text style={styles.label}>Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={handlePasswordToggle}>
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color={"#7E7E7E"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUpdatePassword}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color:'#7E7E7E',
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
    color:'#7E7E7E',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    color:'#7E7E7E',
  },
  updateButtonText: {
    marginLeft: 10,
    color: '#5B5D8B',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#5B5D8B',
    alignItems: 'center',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminProfileScreen;
