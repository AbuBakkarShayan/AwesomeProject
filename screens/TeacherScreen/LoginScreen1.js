import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const LoginScreen1 = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const halfScreenHeight = screenHeight / 2.2;
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setname] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginEndPoint = `${baseURL}/user/loginuser`;

  const handleLogin = async () => {
    try {
      const response = await fetch(loginEndPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);

        if (responseData.status === 'Success') {
          if (responseData.data && responseData.data.length > 0) {
            const user = responseData.data[0];
            const role = user.role;

            await AsyncStorage.setItem('userRole', role);
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('phoneNo', phoneNo);

            const isFirstLogin = user.isFirstLogin || 'False';

            if (role === 'Student') {
              if (!user.id || !user.department) {
                throw new Error('Missing studentId or department');
              }
              await AsyncStorage.setItem('studentId', user.id.toString());
              await AsyncStorage.setItem('departmentId', user.department);
              console.log(
                'StudentId: ',
                user.id.toString(),
                'StudentDepartmentId:',
                user.department,
                'User Role: ',
                user.role,
              );
              navigation.navigate('StudentDashboard', {
                studentId: user.id,
                isFirstLogin,
              });
            } else if (role === 'Teacher') {
              if (!user.id) {
                throw new Error('Missing teacherId');
              }
              await AsyncStorage.setItem('teacherId', user.id.toString());
              console.log(
                'teacherId',
                user.id.toString(),
                'user Role: ',
                user.role,
              );
              navigation.navigate('TeacherDashboard', {
                teacherId: user.id,
                isFirstLogin,
              });
            } else if (role === 'Admin') {
              navigation.navigate('AdminDashboard');
            } else {
              throw new Error('Invalid role');
            }
          } else {
            Alert.alert('Login Failed', 'Invalid username or password.');
          }
        } else {
          Alert.alert(
            'Login Failed',
            responseData.message || 'Invalid username or password.',
          );
        }
      } else {
        Alert.alert('Failed to login', 'Please try again later.');
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('An error occurred while logging in:', error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View
          style={{
            height: halfScreenHeight,
            width: screenWidth,
            backgroundColor: '#5B5D8B',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 30, color: 'white'}}>
            Digital Library & Lesson Plan
          </Text>
          <Text>
            A project of Northern University, Nowshera (KPK, Pakistan)
          </Text>
        </View>
        <Text style={styles.title}>Please Sign in to Continue</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#7E7E7E"
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7E7E7E"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={25}
              color="#7E7E7E"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 25,
    fontSize: 24,
    marginBottom: 20,
    color: '#7E7E7E',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    color: 'black',
    marginBottom: 20,
    fontSize: 18,
    paddingHorizontal: 30,
    paddingRight: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: 12,
    right: 30,
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    width: 181,
    height: 59,
    backgroundColor: '#5B5D8B',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen1;
