// // SplashScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('Home'); // Replace 'Home' with the name of your main screen
//     }, 3000); // 3000 milliseconds = 3 seconds

//     return () => clearTimeout(timer); // Cleanup timer
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome to Digital Library and Lesson Plan Project</Text>
//       <Text>Northern University, Nowshera</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#5B5D8B', // Customize the background color
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF', // Customize the text color
//   },
// });

// export default SplashScreen;


import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LoginScreen1'); // Replace 'Home' with the name of your main screen
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DIGITAL LIBRARY & LESSON PLAN</Text>
      <Image source={require('../images/nulogo.jpeg')} style={styles.logo} />
      <Text style={styles.subtitle}>NORTHERN UNIVERSITY NOWSHERA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color:"black"
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color:"black"
  },
});

export default SplashScreen;
