import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/core';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const TeacherDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { teacherId } = route.params || {}; // Get teacherId from route params, use {} to prevent undefined error

  // Ensure teacherId is available
  if (!teacherId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Teacher ID is not available</Text>
      </View>
    );
  }

  //logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const list = [
    {
      index: '1',
      name: 'Courses',
      screen: 'TeacherCoursesScreen'
    },
    {
      index: '2',
      name: 'Library Books',
      screen: 'LibraryBooksScreen',
    },
    {
      index: '3',
      name: 'My Books List',
      screen: 'MyBooksScreen'
    },
    {
      index: '4',
      name: 'Students Log',
      screen: 'StudentLogsScreen'
    },
    {
      index: '5',
      name: 'Profile',
      screen: 'StudentProfileScreen'
    },
  ];

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { teacherId }); // Pass teacherId to the screen
  };

  return (
    <View>
      <FlatList
        style={styles.listStyle}
        keyExtractor={(item) => item.index}
        data={list}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => navigateToScreen(item.screen)}>
              <Text style={styles.textStyle}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    marginTop: 20,
    padding: 8
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default TeacherDashboard;
