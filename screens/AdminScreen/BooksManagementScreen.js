import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/core';
import LogoutButton from './customcomponent/logoutComponent';
import Icon from 'react-native-vector-icons/Ionicons';

const BooksManagementScreen = () => {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();
  const handleAddCourse = () => {
    navigation.navigate('AddBookScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>BooksManagementScreen</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Icon name="add-circle-outline" size={60} color="#5B5D8B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color:"black"
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default BooksManagementScreen;