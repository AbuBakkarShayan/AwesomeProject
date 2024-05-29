import { StyleSheet, Text, View , FlatList, TouchableOpacity,} from 'react-native'
import React from 'react'
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent'
import { useNavigation } from '@react-navigation/core';

export default function MyCourseItemsScreen({navigation}) {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);
  const navigate= useNavigation();
  const list = [
    {
      index: '1',
      name: 'Lesson Plans',
      screen: 'BookmarkLessons',
    },
    {
      index: '2',
      name: 'Books',
      screen: 'BookmarkBooks', // Define the corresponding screen name
    
    },
    {
      index: '3',
      name: 'Downloads',
      screen: 'Downloads',
    },
  ];

  const navigateToScreen = (screenName)=>{
    navigation.navigate(screenName);
  }

  return (
    <View>
      <FlatList
        style={styles.listStyle}
        keyExtractor={(item) => item.index}
        data={list}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={()=>navigateToScreen(item.screen)}>
            <Text style={styles.textStyle}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
        />
    </View>
  )
}

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
})