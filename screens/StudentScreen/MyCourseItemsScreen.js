import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
import { useNavigation } from '@react-navigation/core';
import RNFS from 'react-native-fs';

export default function MyCourseItemsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Downloads');
  const [activeSubTab, setActiveSubTab] = useState('DownloadedLessonPlans');
  const [data, setData] = useState([]);

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

  const fetchData = () => {
    // Fetch data from C# API based on the activeTab and activeSubTab
    // Here, we'll use sample data
    const sampleData = [
      { id: '1', name: 'Sample Item 1', author: 'Author 1', image: 'https://via.placeholder.com/100' },
      { id: '2', name: 'Sample Item 2', author: 'Author 2', image: 'https://via.placeholder.com/100' },
    ];
    setData(sampleData);
  };

  const handleDelete = (id) => {
    // Call C# API to delete the item
    setData(data.filter(item => item.id !== id));
  };

  const handleTOC = (id) => {
    // Navigate to PDFReaderScreen with the item id to show table of contents
    navigation.navigate('PDFReaderScreen', { itemId: id });
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={() => handleTOC(item.id)}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.textStyle}>{item.name}</Text>
        <Text style={styles.textStyle}>{item.author}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteIcon}>
        <Text style={styles.iconText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleTOC(item.id)} style={styles.tocIcon}>
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
        keyExtractor={(item) => item.id}
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
