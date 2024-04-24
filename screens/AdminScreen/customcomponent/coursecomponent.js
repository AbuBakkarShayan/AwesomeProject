import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CourseComponent = ({ courseName, onEdit, onDelete, onEnrollStudent, onEnrollTeacher, navigation }) => {


  return (
    <View style={styles.container}>
      <Text style={styles.courseName}>{courseName}</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={onEdit}>
          <Icon name="create-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Icon name="trash-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onEnrollStudent}>
          <Icon name="person-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onEnrollTeacher}>
          <Icon name="school-outline" size={24} color="#C4C4C4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  courseName: {
    fontSize: 16,
    color:"#C4C4C4",
  },
  iconsContainer: {
    flexDirection: 'row',
  },
});

export default CourseComponent;
