import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent'

const MyBooks=({navigation})=> {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  return (
    <View>
      <Text>MyBooks</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default MyBooks;