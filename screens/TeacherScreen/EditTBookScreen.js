// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   Alert,
//   StyleSheet,
// } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
// import baseURL from '../../config';
// import {useNavigation} from '@react-navigation/native';

// import {Dropdown} from 'react-native-element-dropdown';

// const EditBookScreen = ({navigation, route}) => {
//   const {bookId, teacherId} = route.params;

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => <LogoutButton />,
//     });
//   }, [navigation]);

//   const [title, setTitle] = useState('');
//   const [category, setCategory] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [coverImage, setCoverImage] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [author, setAuthor] = useState('');
//   const [keywords, setKeywords] = useState('');
//   const [uploadType, setUploadType] = useState('Private');
//   const uploadTypeOptions = [
//     {label: 'Private', value: 'Private'},
//     {label: 'Public', value: 'Public'},
//   ];

//   const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${baseURL}/book/getBookCategory`);
//         const result = await response.json();

//         if (Array.isArray(result.data)) {
//           const transformedData = result.data.map(item => ({
//             label: item.categroyName,
//             value: item.categoryId,
//           }));
//           setCategories(transformedData);
//         } else {
//           console.error('Fetched data is not an array:', result.data);
//           Alert.alert('Error', 'Unexpected data format');
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//         Alert.alert('Error', 'Failed to fetch categories');
//       }
//     };

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       try {
//         const response = await fetch(`${baseURL}/book/getBook/${bookId}`);
//         const result = await response.json();

//         if (result.status === 'Success' && result.data) {
//           setTitle(result.data.bookName);
//           setCategory(result.data.categoryId);
//           setCoverImage({uri: result.data.bookImage});
//           setPdfFile({uri: result.data.bookPdf});
//           setAuthor(result.data.bookAuthor);
//           setKeywords(result.data.keywords);
//           setUploadType(result.data.uploadType);
//         } else {
//           throw new Error('Failed to fetch book details');
//         }
//       } catch (error) {
//         console.error('Error fetching book details:', error);
//         Alert.alert('Error', 'Failed to fetch book details');
//       }
//     };

//     fetchBookDetails();
//   }, [bookId]);

//   const handleCoverImagePick = async () => {
//     try {
//       const doc = await DocumentPicker.pickSingle({
//         type: [DocumentPicker.types.images],
//       });
//       if (doc.size > MAX_FILE_SIZE) {
//         Alert.alert(
//           'Error',
//           'Cover image file size exceeds the maximum limit of 50 MB',
//         );
//         return;
//       }
//       setCoverImage(doc);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User canceled the upload', err);
//       } else {
//         console.log(err);
//       }
//     }
//   };

//   const handlePdfFilePick = async () => {
//     try {
//       const doc = await DocumentPicker.pickSingle({
//         type: [DocumentPicker.types.pdf],
//       });
//       if (doc.size > MAX_FILE_SIZE) {
//         Alert.alert(
//           'Error',
//           'PDF file size exceeds the maximum limit of 50 MB',
//         );
//         return;
//       }
//       setPdfFile(doc);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User canceled the upload', err);
//       } else {
//         console.log(err);
//       }
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       if (
//         !title ||
//         !category ||
//         !coverImage ||
//         !pdfFile ||
//         !author ||
//         !keywords
//       ) {
//         throw new Error('Please fill in all fields');
//       }

//       const formData = new FormData();
//       formData.append('bookName', title);
//       formData.append('categoryId', category);
//       formData.append('bookImage', {
//         uri: coverImage.uri,
//         type: coverImage.type,
//         name: coverImage.name,
//       });
//       formData.append('bookPdf', {
//         uri: pdfFile.uri,
//         type: pdfFile.type,
//         name: pdfFile.name,
//       });
//       formData.append('bookAuthor', author);
//       formData.append('keywords', keywords);
//       formData.append('uploaderId', teacherId);
//       formData.append('uploadType', uploadType);

//       const url = `${baseURL}/book/updateBook/${bookId}`;
//       console.log('Request URL:', url);
//       console.log('Form Data:', formData);

//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new Error(`Failed to update book: ${errorMessage}`);
//       }

//       const result = await response.json();
//       console.log('Update result:', result);

//       if (result.status !== 'Success') {
//         throw new Error(result.message);
//       }

//       console.log('Teacher ID:', result.teacherId);
//       console.log('Image Path:', result.imagePath);
//       console.log('PDF Path:', result.pdfPath);

//       navigation.navigate('PdfReaderScreen', {pdfPath: result.pdfPath});

//       Alert.alert('Success', 'Successfully updated the book');
//       console.log(result);
//     } catch (error) {
//       console.log('Error updating book:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Title"
//         placeholderTextColor="#7E7E7E"
//         value={title}
//         onChangeText={setTitle}
//       />
//       <Dropdown
//         style={styles.input}
//         placeholder="Category"
//         placeholderTextColor="#7E7E7E"
//         data={categories}
//         labelField="label"
//         valueField="value"
//         value={category}
//         onChange={item => setCategory(item.value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Cover Image"
//         placeholderTextColor="#7E7E7E"
//         editable={false}
//         value={coverImage ? coverImage.name : ''}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleCoverImagePick}>
//         <Text style={styles.buttonText}>Browse Cover Image</Text>
//       </TouchableOpacity>
//       <TextInput
//         style={styles.input}
//         placeholder="PDF File"
//         placeholderTextColor="#7E7E7E"
//         editable={false}
//         value={pdfFile ? pdfFile.name : ''}
//       />
//       <TouchableOpacity style={styles.button} onPress={handlePdfFilePick}>
//         <Text style={styles.buttonText}>Browse PDF File</Text>
//       </TouchableOpacity>
//       <TextInput
//         style={styles.input}
//         placeholder="Author"
//         placeholderTextColor="#7E7E7E"
//         value={author}
//         onChangeText={setAuthor}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Keywords"
//         placeholderTextColor="#7E7E7E"
//         value={keywords}
//         onChangeText={setKeywords}
//       />
//       <Dropdown
//         style={styles.input}
//         placeholder="Upload Type"
//         placeholderTextColor="#7E7E7E"
//         data={uploadTypeOptions}
//         labelField="label"
//         valueField="value"
//         value={uploadType}
//         onChange={item => setUploadType(item.value)}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleUpdate}>
//         <Text style={styles.buttonText}>Update Book</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   input: {
//     width: '80%',
//     marginBottom: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     color: 'black',
//   },
//   button: {
//     backgroundColor: '#5B5D8B',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
// });

// export default EditBookScreen;
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {useNavigation, useRoute} from '@react-navigation/core';
import {Dropdown} from 'react-native-element-dropdown';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
import baseURL from '../../config';

const EditBookScreen = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();
  const route = useRoute();
  const {bookId, onBookUpdated} = route.params || {};

  console.log('EditBookScreen route params:', route.params);
  console.log('Editing book with ID:', bookId);

  const [bookDetails, setBookDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [newPdf, setNewPdf] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (bookId) {
      fetchBookDetails();
    } else {
      setIsLoading(false);
      Alert.alert('Error', 'Book ID is missing');
      navigation.goBack();
    }
  }, [bookId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseURL}/book/getBookCategory`);
        const result = await response.json();

        if (Array.isArray(result.data)) {
          const transformedData = result.data.map(item => ({
            label: item.categroyName,
            value: item.categoryId,
          }));
          setCategories(transformedData);
        } else {
          console.error('Fetched data is not an array:', result.data);
          Alert.alert('Error', 'Unexpected data format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(
        `${baseURL}/book/getSingleBook?bookId=${bookId}`,
      );
      const result = await response.json();
      if (result.status === 'Success') {
        setBookDetails(result.data);
        setCategory(result.data.categoryId);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setIsLoading(false);
    }
  };

  const handleUpdateBook = async () => {
    console.log('Updating book with ID:', bookId);

    try {
      const formData = new FormData();
      formData.append('bookId', bookId);
      formData.append('uploaderId', bookDetails.uploaderId || 0);
      formData.append('bookName', bookDetails.bookName);
      formData.append('bookAuthor', bookDetails.bookAuthorName);
      formData.append('categoryId', category); // Ensure categoryId is appended

      if (newPdf) {
        formData.append('bookPdf', {
          uri: newPdf.uri,
          type: newPdf.type,
          name: newPdf.name,
        });
      }

      if (newImage) {
        formData.append('bookImage', {
          uri: newImage.uri,
          type: newImage.type,
          name: newImage.name,
        });
      }

      const response = await fetch(
        `${baseURL}/book/updateBook?bookId=${bookId}`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const result = await response.json();
      console.log('Response from API:', result);

      if (result.status === 'Success') {
        Alert.alert('Success', 'Book updated successfully');
        if (onBookUpdated) {
          onBookUpdated();
        }
        navigation.goBack();
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      setNewPdf(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error:', err);
      }
    }
  };

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setNewImage(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error:', err);
      }
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Book Name</Text>
      <TextInput
        style={styles.input}
        value={bookDetails.bookName}
        onChangeText={text => setBookDetails({...bookDetails, bookName: text})}
      />

      <Text style={styles.label}>Author Name</Text>
      <TextInput
        style={styles.input}
        value={bookDetails.bookAuthorName}
        onChangeText={text =>
          setBookDetails({...bookDetails, bookAuthorName: text})
        }
      />

      <Text style={styles.label}>Category</Text>
      <Dropdown
        style={styles.input}
        placeholder="Select Category"
        placeholderTextColor="#7E7E7E"
        data={categories}
        labelField="label"
        valueField="value"
        value={category}
        onChange={item => setCategory(item.value)}
      />

      <TouchableOpacity style={styles.button} onPress={pickPdf}>
        <Text style={styles.buttonText}>Select PDF</Text>
      </TouchableOpacity>

      {newPdf && <Text>Selected PDF: {newPdf.name}</Text>}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Cover Image</Text>
      </TouchableOpacity>

      {newImage && (
        <Image source={{uri: newImage.uri}} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateBook}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#5B5D8B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EditBookScreen;
