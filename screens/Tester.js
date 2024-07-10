// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import baseURL, {imageBaseURL} from '../config';
// import {useNavigation} from '@react-navigation/native';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';

// const Tester = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await fetch(`${baseURL}/book/getall`);
//         const result = await response.json();
//         const {status, data} = result;
//         if (status === 'Success') {
//           console.log(data); // Log the book details to the console
//           setBooks(data);
//         } else {
//           setError('No books available');
//         }
//       } catch (err) {
//         console.error(err); // Log any errors to the console
//         setError('An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>{error}</Text>
//       </View>
//     );
//   }

//   const openPdfWithWPS = async (pdfUrl, pdfName) => {
//     try {
//       const localFile = `${RNFS.DocumentDirectoryPath}/${pdfName}`;

//       const options = {
//         fromUrl: pdfUrl,
//         toFile: localFile,
//       };

//       await RNFS.downloadFile(options).promise;

//       const filePath = `file://${localFile}`;

//       // Sending intent to open PDF with WPS Office
//       const androidIntent = {
//         mimeType: 'application/pdf',
//         uri: filePath,
//         packageName: 'cn.wps.moffice_eng',
//       };

//       await Share.open(androidIntent);
//     } catch (error) {
//       console.error('Error opening PDF:', error);
//     }
//   };

//   const renderItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.bookItem}
//       onPress={() =>
//         openPdfWithWPS(
//           `${imageBaseURL}/BookPDFFolder/${item.bookPdfPath}`,
//           item.bookPdfPath,
//         )
//       }>
//       <Image
//         source={{
//           uri: `${imageBaseURL}/BookImageFolder/${item.bookCoverPagePath}`,
//         }}
//         style={styles.bookImage}
//       />
//       <View style={styles.bookDetails}>
//         <Text style={styles.bookTitle}>{item.bookName}</Text>
//         <Text style={styles.bookAuthor}>{item.bookAuthorName}</Text>
//         <Text style={styles.bookCategory}>{item.categroyName}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={books}
//         renderItem={renderItem}
//         keyExtractor={item => item.bookId.toString()}
//       />
//     </View>
//   );
// };

// export default Tester;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   bookItem: {
//     flexDirection: 'row',
//     marginBottom: 16,
//     padding: 8,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     elevation: 1,
//   },
//   bookImage: {
//     width: 50,
//     height: 70,
//     marginRight: 16,
//   },
//   bookDetails: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   bookTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   bookAuthor: {
//     fontSize: 14,
//     color: '#555',
//   },
//   bookCategory: {
//     fontSize: 12,
//     color: '#888',
//   },
// });
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Tester = () => {
  return (
    <View>
      <Text>tester</Text>
    </View>
  );
};

export default Tester;

const styles = StyleSheet.create({});
