// import { StyleSheet, Text, View, TextInput  } from 'react-native'
// import React from 'react'
// import {Ionicons} from 'react-native-vector-icons'

// const LibraryScreen = () => {
//   return (
//     <View>
//       <Text>LibraryScreen</Text>
//       <View style={styles.searchBar}>
//       <Ionicons name="search" size={30} />
//       <TextInput placeholder='Search'  />
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//     searchBar:{
//         backgroundColor:'#F0EEEE',
//         height:50,
//         borderRadius:5,
//         marginHorizontal:15,
//         flexDirection:'row'
//     }
// })

// export default LibraryScreen


import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';

const LibraryScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const searchBooks = async () => {
    try {
      // Call your backend API here with the searchTerm
      const response = await fetch(`YOUR_BACKEND_API_ENDPOINT?q=${searchTerm}`);
      const data = await response.json();
      setBooks(data); // Assuming your API returns an array of books
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter keyword"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <Button title="Search" onPress={searchBooks} />
      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
            <View style={styles.bookInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>Author: {item.author}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookImage: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
  },
});

export default LibraryScreen;