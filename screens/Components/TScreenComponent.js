import { View, Text, StyleSheet,FlatList,Image } from 'react-native';
import React from 'react';




const TScreenComponent = (props) => {
  <Text>Teacher Dashboard</Text>
  return (
    <View>
      <View style={styles.div1}>
      <Text>{props.title}</Text>
      </View>
      
    </View>
  )
}
const styles = StyleSheet.create({
    div1:{
      
      //height:100,
      backgroundColor:"blue",
      color:"black",
      // paddingBottom:50
    }
})

export default TScreenComponent;