import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const AddTOC = ({ route, navigation }) => {
  const [nameOfContent, setNameOfContent] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tocItems, setTocItems] = useState([]);
  const [bookId, setBookId] = useState(null);

  useEffect(() => {
    if (route.params?.bookId) {
      setBookId(route.params.bookId);
      fetchTOCItems(route.params.bookId);
    }
  }, [route.params?.bookId]);

  // Fetch TOC items for the book
  const fetchTOCItems = async (bookId) => {
    try {
      const response = await fetch(`${baseURL}/book/getTOC?bookId=${bookId}`);
      const result = await response.json();
      if (result.status === 'Success') {
        setTocItems(result.data);
      } else {
        console.log('Error fetching TOC items:', result.message);
      }
    } catch (error) {
      console.log('Error fetching TOC items:', error);
    }
  };

  // Logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const handleAddTOC = async () => {
    if (!nameOfContent || !pageNo || !keywords) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${baseURL}/book/addTOC`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          tocContent: nameOfContent,
          pageNo,
          keywords: keywords.split(',').map(keyword => keyword.trim()),
        }),
      });

      const result = await response.json();
      if (result.status !== 'Success') {
        throw new Error(result.message);
      }

      const newTOCItem = {
        id: result.tocid,
        tocContent: nameOfContent,
        pageNo,
        keywords: keywords.split(',').map(keyword => keyword.trim())
      };

      setTocItems([...tocItems, newTOCItem]);
      setNameOfContent('');
      setPageNo('');
      setKeywords('');
    } catch (error) {
      console.log('Error adding TOC:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteTOC = async (id) => {
    try {
      const response = await fetch(`${baseURL}/book/deleteTOC?tocId=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.status !== 'Success') {
        throw new Error(result.message);
      }

      setTocItems(tocItems.filter(item => item.id !== id));
    } catch (error) {
      console.log('Error deleting TOC:', error);
      Alert.alert('Error', error.message);
    }
  };

  const renderTOCItem = ({ item }) => (
    <View style={styles.tocItemContainer}>
      <View>
        <Text>{item.tocContent} (Page: {item.tocPageNo})</Text>
        <Text>{item.keywords.join(', ')}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteTOC(item.tocId)}>
        <Icon name="trash-outline" size={24} color="#C4C4C4" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name Of Content"
        placeholderTextColor={'black'}
        value={nameOfContent}
        onChangeText={setNameOfContent}
      />
      <TextInput
        style={styles.input}
        placeholder="Page No"
        placeholderTextColor={'black'}
        value={pageNo}
        onChangeText={setPageNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Keywords (comma separated)"
        placeholderTextColor={'black'}
        value={keywords}
        onChangeText={setKeywords}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTOC}>
        <Text style={styles.buttonText}>Add TOC</Text>
      </TouchableOpacity>
      <FlatList
        data={tocItems}
        keyExtractor={(item) => item.tocId.toString()}
        renderItem={renderTOCItem}
      />
      <TouchableOpacity style={styles.submitButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
  },
  addButton: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
  tocItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default AddTOC;
