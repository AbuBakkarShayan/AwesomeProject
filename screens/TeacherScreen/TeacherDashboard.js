import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const TeacherDashboard = () => {
  const list = [
    {
      index: '1',
      name: 'Courses',
      
    },
    {
      index: '2',
      name: 'Library Books',
    
    },
    {
      index: '3',
      name: 'My Books List',
          },
    {
      index: '4',
      name: 'Students Log',
          
    },
    {
      index: '5',
      name: 'Profile',
    },
  ];

  return (
    <View>
      <FlatList
        style={styles.listStyle}
        keyExtractor={(item) => item.index}
        data={list}
        renderItem={({ item }) => (
          <View style={styles.listStyle}>
            <TouchableOpacity>
            <Text style={styles.textStyle}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  listStyle:{
    textAlign:"center",
    marginTop:20,
    marginHorizontal:5, 
   
  },
  textStyle: {
    fontSize: 30,
    color:"white",
    backgroundColor:"#5B5D8B",
    padding:30, 
    textAlign:"center",
   // paddingBottom:30
  },
});

export default TeacherDashboard;