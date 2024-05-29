// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Replace 'Home' with the name of your main screen
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Customize the background color
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF', // Customize the text color
  },
});

export default SplashScreen;
