import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";


const Home = ({navigation}) =>{
    return(
        <View>
            <Button title="Go to Image Demo Page" onPress={()=>   navigation.navigate("ImageScreen") }></Button>
            <Button title="Go to Counter Screen" onPress={()=> navigation.navigate("CounterScreen")}></Button>
            <Button title="Go to Color Screen" onPress={()=> navigation.navigate("ColorScreen")}></Button>
            <Button title="Go to LoginScreen1 Form" onPress={()=>navigation.navigate("LoginScreen")}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    textStyle:{
        fontSize: 40,
    },
})

export default Home;