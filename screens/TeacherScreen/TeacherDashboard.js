import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const TeacherDashboard = () => {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  const navigation=useNavigation();
  const list = [
    {
      index: '1',
      name: 'Courses',
      screen:'TeacherCoursesScreen'
      
    },
    {
      index: '2',
      name: 'Library Books',
      screen:'LibraryBooksScreen',
    },
    {
      index: '3',
      name: 'My Books List',
      screen:'MyBooksScreen'
    },
    {
      index: '4',
      name: 'Students Log',
      screen:'StudentLogsScreen'  
    },
    {
      index: '5',
      name: 'Profile',
      screen:'StudentProfileScreen'
    },
  ];
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName); // Navigate to the screen based on screen name
  };
  return (
    <View>
      <FlatList
        style={styles.listStyle}
        keyExtractor={(item) => item.index}
        data={list}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={()=>navigateToScreen(item.screen)}>
            <Text style={styles.textStyle}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    marginTop: 20,
    padding:8
  },
  listItem: {
    backgroundColor: '#5B5D8B',
    margin: 5,
    padding: 20,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default TeacherDashboard;