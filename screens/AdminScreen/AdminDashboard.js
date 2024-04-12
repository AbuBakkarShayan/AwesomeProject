import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const AdminDashboard = () => {
  const navigation = useNavigation(); // Initialize navigation

  const list = [
    { index: '1', name: 'Student Management' },
    { index: '2', name: 'Teacher Management' },
    { index: '3', name: 'Course Management' },
    { index: '4', name: 'Books Management' },
    { index: '5', name: 'Profile' },
  ];

  const handleItemPress = async (itemName) => {
    try {
      // Navigate to the corresponding screen based on the item name
      if (itemName === 'Student Management') {
        navigation.navigate('StudentDepartmentScreen');
      } else if (itemName === 'Teacher Management') {
        navigation.navigate('TeacherDepartmentScreen');
      } else if (itemName === 'Course Management') {
        navigation.navigate('CourseManagementScreen');
      } else if (itemName === 'Books Management') {
        navigation.navigate('BooksManagementScreen');
      } else if (itemName === 'Profile') {
        navigation.navigate('AdminProfileScreen');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View>
      <FlatList
        style={styles.listStyle}
        keyExtractor={(item) => item.index}
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item.name)}>
            <View style={styles.listItem}>
              <Text style={styles.textStyle}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    marginTop: 20,
    padding:8
  },
  listItem: {
    backgroundColor: '#5B5D8B',
    margin: 5,
    padding: 20,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default AdminDashboard;
