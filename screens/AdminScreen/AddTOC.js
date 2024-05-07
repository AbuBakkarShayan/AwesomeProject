import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons for cancel icon

const AddTOC = () => {
  const [keywords, setKeywords] = useState([]); // State to store keywords
  const [keywordInput, setKeywordInput] = useState(''); // State to store the value of keyword input

  // Function to add a keyword
  const addKeyword = () => {
    if (keywordInput.trim() !== '') {
      if (keywords.length < 5) { // Limit keywords to 5
        setKeywords([...keywords, keywordInput.trim()]);
        setKeywordInput('');
      } else {
        alert('You can only add up to 5 keywords.');
      }
    }
  };

  // Function to remove a keyword
  const removeKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View style={styles.container}>
      {/* TextInput for Name of Content */}
      <TextInput
        style={styles.input}
        placeholder="Name of Content"
        placeholderTextColor="#7E7E7E"
      />
      {/* TextInput for Page No */}
      <TextInput
        style={styles.input}
        placeholder="Page No"
        placeholderTextColor="#7E7E7E"
      />
      {/* Keywords Input */}
      <View style={styles.keywordsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {keywords.map((keyword, index) => (
            <View key={index} style={styles.keywordBox}>
              <Text style={styles.keywordText}>{keyword}</Text>
              <TouchableOpacity onPress={() => removeKeyword(index)} style={styles.cancelButton}>
                <Icon name="close-circle" size={20} color="#5B5D8B" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* Keyword Input */}
      <View style={styles.keywordInputContainer}>
        <TextInput
          style={styles.keywordInput}
          placeholder="Enter keyword"
          placeholderTextColor="#7E7E7E"
          value={keywordInput}
          onChangeText={(text) => setKeywordInput(text)}
          onSubmitEditing={addKeyword}
        />
        <TouchableOpacity style={styles.addButton} onPress={addKeyword}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add TOC</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color:'#7E7E7E',
  },
  keywordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  keywordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    
  },
  keywordText: {
    marginRight: 5,
    color:'#7E7E7E',
  },
  cancelButton: {
    marginLeft: 5,
  },
  keywordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  keywordInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    flex: 1,
    color:'#7E7E7E',
  },
  addButton: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf:'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddTOC;
