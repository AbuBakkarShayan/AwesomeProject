import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const books = [
    {
        id: 1,
        title: 'Artificial Intelligence',
        author: 'Robert Witalk',
        //cover: 'https://linktoimage.com/ai-cover.jpg' // Replace with actual image URL
    },
    {
        id: 2,
        title: 'C++ 9th Edition',
        author: 'Robert Witalk',
        //cover: 'https://linktoimage.com/cpp9-cover.jpg' // Replace with actual image URL
    },
    {
        id: 3,
        title: 'C++ 6th Edition',
        author: 'Robert Witalk',
        //cover: 'https://linktoimage.com/cpp6-cover.jpg' // Replace with actual image URL
    },
];

const LibraryScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={"black"} />
            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Downloaded Books</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>My Books List</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {books.map(book => (
                    <View key={book.id} style={styles.bookContainer}>
                        <Image source={{ uri: book.cover }} style={styles.bookCover} />
                        <View style={styles.bookDetails}>
                            <Text style={styles.bookTitle}>{book.title}</Text>
                            <Text style={styles.bookAuthor}>{book.author}</Text>
                        </View>
                        <View style={styles.bookActions}>
                            <Icon name="download"  size={30} color="#5B5D8B"/>
                            <Icon name="bookmark"  size={30} color="#5B5D8B"/>
                            <Icon name="list" size={30} color="#5B5D8B"/>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 15,
        backgroundColor: '#5a67d8',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerSubtitle: {
        color: '#e2e8f0',
        fontSize: 14,
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 20,
        borderRadius: 10,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        color:'black',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    tabButton: {
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'black',
      
        backgroundColor:"white"
    },
    tabButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5a67d8',
        

    },
    bookContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    bookCover: {
        width: 50,
        height: 70,
        marginRight: 15,
    },
    bookDetails: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color:'black'
    },
    bookAuthor: {
        color: '#718096',
    },
    bookActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 100,
    },
});

export default LibraryScreen;
