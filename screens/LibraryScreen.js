import { StyleSheet, Text, View, TextInput  } from 'react-native'
import React from 'react'
import {Ionicons} from 'react-native-vector-icons'

const LibraryScreen = () => {
  return (
    <View>
      <Text>LibraryScreen</Text>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={30} />
      <TextInput placeholder='Search'  />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    searchBar:{
        backgroundColor:'#F0EEEE',
        height:50,
        borderRadius:5,
        marginHorizontal:15,
        flexDirection:'row'
    }
})

export default LibraryScreen