import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../config';

export const BookmarksContext = createContext();

export const BookmarksProvider = ({ children }) => {
    const [bookmarkedBooks, setBookmarkedBooks] = useState(new Set());

    useEffect(() => {
        const loadBookmarkedBooks = async () => {
            try {
                const storedBookmarks = await AsyncStorage.getItem('bookmarkedBooks');
                if (storedBookmarks) {
                    const parsedBookmarks = JSON.parse(storedBookmarks);
                    setBookmarkedBooks(new Set(parsedBookmarks));
                }
            } catch (error) {
                console.error('Error loading bookmarks:', error);
            }
        };

        loadBookmarkedBooks();
    }, []);

    useEffect(() => {
        // Update AsyncStorage whenever bookmarkedBooks state changes
        AsyncStorage.setItem('bookmarkedBooks', JSON.stringify(Array.from(bookmarkedBooks)));
    }, [bookmarkedBooks]);

    const updateBookmarkedBooks = async (bookId, isBookmarked, userId, role, bookName, bookAuthorName) => {
        const url = isBookmarked ? `${baseURL}/bookmark/removeBookMark?userId=${userId}&bookId=${bookId}&userType=${role}` : `${baseURL}/bookmark/addBookMark`;
        const method = isBookmarked ? 'DELETE' : 'POST';
        const body = isBookmarked ? null : JSON.stringify({
            bookId,
            bookName,
            bookAuthorName,
            bookmarkOwnerId: userId,
            bookmarkOwnerType: role,
        });

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const data = await response.json();
                if (data.status === 'Success') {
                    const updatedBookmarkedBooks = new Set(bookmarkedBooks);
                    if (isBookmarked) {
                        updatedBookmarkedBooks.delete(bookId);
                    } else {
                        updatedBookmarkedBooks.add(bookId);
                    }
                    setBookmarkedBooks(updatedBookmarkedBooks);
                    Alert.alert('Success', data.message);
                } else {
                    throw new Error(data.message);
                }
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error updating bookmark:', error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <BookmarksContext.Provider value={{ bookmarkedBooks, updateBookmarkedBooks }}>
            {children}
        </BookmarksContext.Provider>
    );
};
