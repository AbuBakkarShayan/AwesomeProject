// CourseComponent.js
import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CourseComponent = ({ courses, onEdit, onDelete, onEnrollStudent, onEnrollTeacher }) => {
  const renderCourseItem = ({ item }) => (
    <View style={styles.courseContainer}>
      <Text style={styles.courseName}>{item.courseName}</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => onEdit(item.id)}>
          <Icon name="create-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Icon name="trash-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEnrollStudent(item.id)}>
          <Icon name="person-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEnrollTeacher(item.id)}>
          <Icon name="school-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={courses}
      keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      renderItem={renderCourseItem}
    />
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  courseName: {
    fontSize: 16,
    color: "#C4C4C4",
  },
  iconsContainer: {
    flexDirection: 'row',
  },
});

export default CourseComponent;
