import React from 'react';
import { StyleSheet, Text, View, FlatList,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importing useNavigation hook
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
const StudentDashboard = () => {
  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);
  const navigation = useNavigation();
  const list = [
    {
      index: '1',
      name: 'Courses',
      screen: 'CoursesScreen',
      
    },
    {
      index: '2',
      name: 'Library Items',
      screen: 'LibraryScreen', // Define the corresponding screen name
    
    },
    {
      index: '3',
      name: 'My Course Items',
      screen: 'MyCourseItemsScreen',
    },
    {
      index: '4',
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

export default StudentDashboard;

