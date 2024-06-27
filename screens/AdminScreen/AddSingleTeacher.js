import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddSingleUser from './customcomponent/AddSingleUser';
import LogoutButton from './customcomponent/logoutComponent';

const AddSingleTeacher = ({ navigation }) => {
  // Logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const handleUserSubmit = (data) => {
    // Handle user registration response
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <AddSingleUser userType="Teacher" onSubmit={handleUserSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default AddSingleTeacher;
