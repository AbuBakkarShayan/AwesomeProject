import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
import { useNavigation } from '@react-navigation/core';
import RNFS from 'react-native-fs';

export default function MyCourseItemsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Downloads');
  const [activeSubTab, setActiveSubTab] = useState('DownloadedLessonPlans');
  const [data, setData] = useState([]);
  const userId = 1; // Assuming you have a userId state or prop
  const userType = 'User'; // Replace with actual user type, e.g., 'Teacher' or 'Student'

  // logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  useEffect(() => {
    // Fetch data based on active tab and sub-tab
    fetchData();
  }, [activeTab, activeSubTab]);

  const fetchData = async () => {
    try {
      let endpoint = '';
      if (activeTab === 'Downloads') {
        if (activeSubTab === 'DownloadedLessonPlans') {
          endpoint = '/api/DownloadedLessonPlans';
        } else if (activeSubTab === 'DownloadedBooks') {
          endpoint = '/api/DownloadedBooks';
        }
      } else if (activeTab === 'Bookmarks') {
        if (activeSubTab === 'BookmarkBooks') {
          endpoint = `/api/BookMark/getBookMark?userId=${userId}&userType=${userType}`;
        }
        else if (activeSubTab === 'BookmarkLessonPlans') {
          endpoint = '/api/DownloadedBooks';
        }
      }
  
      console.log(`Fetching data from: http://192.168.91.26/FYPAPI${endpoint}`); // Debugging log
      const response = await fetch(`http://192.168.91.26/FYPAPI${endpoint}`); // Use 10.0.2.2 for Android emulator
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Fetched data:', result); // Debugging log
      if (result.status === 'Success') {
        setData(result.data);
      } else {
        alert('Failed to fetch data: ' + result.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data: ' + error.message);
    }
  };
  

  const handleDelete = (id) => {
    // Call C# API to delete the item
    setData(data.filter(item => item.bookmarkId !== id));
  };

  const handleTOC = (id) => {
    // Navigate to PDFReaderScreen with the item id to show table of contents
    navigation.navigate('PDFReaderScreen', { itemId: id });
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={() => handleTOC(item.bookId)}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.image} />
        <Text style={styles.textStyle}>Book ID: {item.bookId}</Text>
        <Text style={styles.textStyle}>Bookmark ID: {item.bookmarkId}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.bookmarkId)} style={styles.deleteIcon}>
        <Text style={styles.iconText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleTOC(item.bookId)} style={styles.tocIcon}>
        <Text style={styles.iconText}>TOC</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Downloads' ? styles.activeTab : {}]}
          onPress={() => setActiveTab('Downloads')}
        >
          <Text style={activeTab === 'Downloads' ? styles.activeTabText : styles.tabText}>Downloads</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Bookmarks' ? styles.activeTab : {}]}
          onPress={() => setActiveTab('Bookmarks')}
        >
          <Text style={activeTab === 'Bookmarks' ? styles.activeTabText : styles.tabText}>Bookmarks</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'Downloads' && (
        <View style={styles.subTabContainer}>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'DownloadedLessonPlans' ? styles.activeSubTab : {}]}
            onPress={() => setActiveSubTab('DownloadedLessonPlans')}
          >
            <Text style={activeSubTab === 'DownloadedLessonPlans' ? styles.activeSubTabText : styles.subTabText}>Downloaded Lesson Plans</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'DownloadedBooks' ? styles.activeSubTab : {}]}
            onPress={() => setActiveSubTab('DownloadedBooks')}
          >
            <Text style={activeSubTab === 'DownloadedBooks' ? styles.activeSubTabText : styles.subTabText}>Downloaded Books</Text>
          </TouchableOpacity>
        </View>
      )}
      {activeTab === 'Bookmarks' && (
        <View style={styles.subTabContainer}>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'BookmarkLessonPlans' ? styles.activeSubTab : {}]}
            onPress={() => setActiveSubTab('BookmarkLessonPlans')}
          >
            <Text style={activeSubTab === 'BookmarkLessonPlans' ? styles.activeSubTabText : styles.subTabText}>Bookmark Lesson Plans</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'BookmarkBooks' ? styles.activeSubTab : {}]}
            onPress={() => setActiveSubTab('BookmarkBooks')}
          >
            <Text style={activeSubTab === 'BookmarkBooks' ? styles.activeSubTabText : styles.subTabText}>Bookmark Books</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={(item) => item.bookmarkId?.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#5B5D8B',
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    backgroundColor: '#5B5D8B',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#5B5D8B',
    paddingVertical: 10,
  },
  subTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeSubTab: {
    backgroundColor: '#5B5D8B',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  subTabText: {
    color: '#fff',
    fontSize: 16,
  },
  activeSubTabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#5B5D8B',
    margin: 5,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  deleteIcon: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  tocIcon: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  iconText: {
    color: 'white',
  },
});
