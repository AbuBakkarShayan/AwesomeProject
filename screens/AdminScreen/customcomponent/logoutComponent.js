import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = ({ iconName = 'logout', iconSize = 24, iconColor = 'white', style = {} }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        const removedUsername = await AsyncStorage.getItem('username');
        const removedPassword = await AsyncStorage.getItem('password');
  
        // Check if the username was successfully removed from AsyncStorage
        if (removedUsername === null && removedPassword ===null) {
          console.log("Username is successfully removed from AsyncStorage");
          navigation.navigate('LoginScreen1');
        } else {
          console.log('Failed to remove username from AsyncStorage');
        }
      } catch (error) {
        console.log("Error cleaning AsyncStorage: ", error);
      }
    };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity onPress={confirmLogout} style={[styles.button, style]}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
});

export default LogoutButton;
