import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';

const StudentHighlights = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const [activeTab, setActiveTab] = useState('allHighlights');
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Text>StudentHighlights</Text>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'myHighlights' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('myHighlights')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'myHighlights' && styles.activeTabButtonText,
            ]}>
            My Highlights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'allHighlights' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('allHighlights')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'allHighlights' && styles.activeTabButtonText,
            ]}>
            All Highlights
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StudentHighlights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#5B5D8B',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B5D8B',
  },
  activeTabButtonText: {
    color: 'white',
  },
});
