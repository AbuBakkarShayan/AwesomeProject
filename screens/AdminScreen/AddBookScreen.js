import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook from React Navigation
import DocumentPicker from 'react-native-document-picker';

const AddBookScreen = () => {
 const navigation = useNavigation(); // Initialize navigation

  const [bookTitle, setBookTitle] = useState('');
  const [bookCategory, setBookCategory] = useState('');
  const [bookPdf, setBookPdf] = useState(null);
  const [bookAuthor, setBookAuthor] = useState('');

  // const handleChooseImage = () => {
  //   ImagePicker.launchImageLibrary({}, response => {
  //     if (response.uri) {
  //       setCourseImage(response.uri);
  //     }
  //   });
  // };

  const handleEmbedURL = () => {
    console.log('Embed URL button pressed');
    // Add logic to handle embedding URL here
  };

  const handleAddBook = () => {
    // Input validation
    // if (!bookTitle || !bookCategory || !bookCoverPage || !bookPdf) {
    //   Alert.alert('All fields are required');
    //   return;
    // }

    // Implement logic to add course (e.g., call API)
    console.log('Add Book button pressed');
    console.log('Book Title:', bookTitle);
    console.log('Book Category:', bookCategory);
    console.log('Book Pdf:', setSelectedFile);
    console.log('Book Author:', bookAuthor);
    // Add your logic to call the API here
    Alert.alert('Book Added Successfully');

    // Navigate to AddTOC screen after adding the book
    navigation.navigate('AddTOC');

  };

  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
  
  }, [selectedFile]);

const selectDoc= async ()=>{
  try{
const doc = await DocumentPicker.pickSingle({
  type:[DocumentPicker.types.pdf],
});
setSelectedFile(doc.name);
  }
  catch(err){
if(DocumentPicker.isCancel(err))
console.log("User cancel the Upoad", err)
else
console.log(err);
  }
}

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={"#7E7E7E"}
        onChangeText={text => setBookTitle(text)}
        value={bookTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor={"#7E7E7E"}
        onChangeText={text => setBookCategory(text)}
        value={bookCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Book PDF"
        placeholderTextColor={"#7E7E7E"}
        value={selectedFile}
        
        editable={false} // Make the TextInput read-only
      />
      <TouchableOpacity style={styles.button} onPress={selectDoc}>
        <Text style={styles.buttonText}>Choose File</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Author"
        placeholderTextColor={"#7E7E7E"}
        onChangeText={text => setBookAuthor(text)}
        value={bookAuthor}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleAddBook}>
        <Text style={styles.buttonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color:"#7E7E7E",
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddBookScreen;