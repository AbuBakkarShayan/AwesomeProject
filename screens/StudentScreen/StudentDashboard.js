import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const StudentDashboard = () => {
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
      name: 'My Course Items',
          },
    {
      index: '4',
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

export default StudentDashboard;