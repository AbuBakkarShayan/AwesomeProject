import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent'

const StudentLogs=({navigation})=> {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  return (
    <View>
      <Text>StudentLogs</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default StudentLogs;