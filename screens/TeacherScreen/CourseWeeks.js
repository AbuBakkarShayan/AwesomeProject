import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
const WeekNo = [
  {
    name: 'Week 1',
  },
  {
    name: 'Week 2',
  },
  {
    name: 'Week 3',
  },
  {
    name: 'Week 4',
  },
  {
    name: 'Week 5',
  },
  {
    name: 'Week 6',
  },
  {
    name: 'Week 7',
  },
  {
    name: 'Week 8',
  },
  {
    name: 'Week 9',
  },
  {
    name: 'Week 10',
  },
  {
    name: 'Week 11',
  },
];

const CourseWeeks = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();
  const route = useRoute();
  const {course, teacherId} = route.params; // Ensure teacherId and course are received from route params

  //onPress={item.function}
  return (
    <View>
      <Text>CourseWeeks</Text>
      <ScrollView>
        {WeekNo.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            onPress={() =>
              navigation.navigate('CourseScreen', {course: item, teacherId})
            } // Pass teacherId to CourseScreen
          >
            <Text style={styles.tileText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={courses}
        keyExtractor={item => item.courseCode.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.courseContainer}
            // onPress={() =>
            //   navigation.navigate('CourseScreen', {course: item, teacherId})
            onPress={() =>
              navigation.navigate('CourseWeeks', {course: item, teacherId})
            } // Pass teacherId to CourseScreen
          >
            <Text style={styles.courseName}>{item.courseName}</Text>
            <Text style={styles.creditHour}>
              Credit Hours: {item.creditHours}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CourseWeeks;

const styles = StyleSheet.create({
  tile: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#5B5D8B',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileText: {
    fontSize: 18,
    color: 'white',
  },
});
