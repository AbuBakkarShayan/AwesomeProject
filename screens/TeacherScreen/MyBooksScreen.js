import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
import { useNavigation } from '@react-navigation/core';
import baseURL from '../../config';

export default function MyBooksScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('downloaded');
  const [downloadedBooks, setDownloadedBooks] = useState([]);
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);

  // Set logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  // Fetch downloaded books from local storage
  const fetchDownloadedBooks = async () => {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const books = files
        .filter(file => file.name.endsWith('.pdf'))
        .map(file => ({ id: file.name, name: file.name.replace('.pdf', ''), screen: 'AssignBook' }));
      setDownloadedBooks(books);
    } catch (error) {
      console.error('Failed to fetch downloaded books:', error);
    }
  };

  // Fetch bookmarked books from API
  const fetchBookmarkedBooks = async () => {
    try {
      const response = await fetch(`${baseURL}/BookMark/getBookMark`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers here
        },
      });
      const data = await response.json();
      if (data && data.bookmarks) {
        setBookmarkedBooks(data.bookmarks);
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarked books:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'downloaded') {
      fetchDownloadedBooks();
    } else if (activeTab === 'bookmarked') {
      fetchBookmarkedBooks();
    }
  }, [activeTab]);

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={() => navigateToScreen(item.screen)}>
        <Text style={styles.textStyle}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Button title="Downloaded Books" onPress={() => setActiveTab('downloaded')} />
        <Button title="Bookmarked Books" onPress={() => setActiveTab('bookmarked')} />
      </View>
      <FlatList
        style={styles.listStyle}
        keyExtractor={(item) => item.id}
        data={activeTab === 'downloaded' ? downloadedBooks : bookmarkedBooks}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  listStyle: {
    marginTop: 20,
    padding: 8,
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
