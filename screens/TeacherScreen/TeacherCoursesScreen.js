import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent'

const Courses=({navigation})=> {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  return (
    <View>
      <Text>Courses</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Courses;