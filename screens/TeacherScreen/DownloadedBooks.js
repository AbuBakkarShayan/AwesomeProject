// import React from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// const DownloadedBooks = ({ route, navigation }) => {
//     const { downloadPaths } = route.params;

//     // Ensure downloadPaths is defined and not empty before use
//     const downloadedBooks = downloadPaths && downloadPaths.length > 0
//         ? downloadPaths.map((path, index) => ({ bookId: index, bookName: `Book ${index + 1}`, downloadPath: path })) // Replace with your actual book data
//         : [];

//     const handleOpenBook = (downloadPath) => {
//         navigation.navigate('PDFReaderScreen', { filePath: downloadPath });
//     };

//     const renderDownloadedBook = ({ item }) => (
//         <TouchableOpacity onPress={() => handleOpenBook(item.downloadPath)}>
//             <View style={styles.bookContainer}>
//                 <Text style={styles.bookTitle}>{item.bookName}</Text>
//                 {/* Render the downloaded book here using the downloadPath */}
//                 {/* For example, using a PDF viewer */}
//                 {/* <PDFView filePath={item.downloadPath} /> */}
//             </View>
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Downloaded Books</Text>
//             <FlatList
//                 data={downloadedBooks}
//                 renderItem={renderDownloadedBook}
//                 keyExtractor={item => item.bookId.toString()}
//                 contentContainerStyle={styles.listContainer}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     listContainer: {
//         marginTop: 10,
//     },
//     bookContainer: {
//         padding: 15,
//         backgroundColor: '#f0f0f0',
//         marginBottom: 10,
//         borderRadius: 8,
//     },
//     bookTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });

// export default DownloadedBooks;
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DownloadedBooks = () => {
  return (
    <View>
      <Text>DownloadedBooks</Text>
    </View>
  )
}

export default DownloadedBooks

const styles = StyleSheet.create({})