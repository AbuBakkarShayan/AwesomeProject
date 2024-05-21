import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent'

export default function MyCourseItems({navigation}) {
  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);
  return (
    <View>
      <Text>MyCourseItems</Text>
    </View>
  )
}

const styles = StyleSheet.create({})