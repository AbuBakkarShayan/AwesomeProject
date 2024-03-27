import React from "react";
import { View, StyleSheet, Text } from "react-native";
import ImageDetail from "./Components/ImageDetail";

const ImageScreen = ()=>{
    return(
        <View>
            <Text style={styles.HeaderText}>Hi I am Image Screen</Text>
            <ImageDetail title="Forest" typeOfImage={require("../images/forest.jpg")} imageScore={9}/>
            <ImageDetail title="Desert" typeOfImage={require("../images/desert.jpg")} imageScore={7}/>
            <ImageDetail title="Ocean" typeOfImage={require("../images/ocean.jpg")} imageScore={4}/>
            
        </View>
    )
}

const styles = StyleSheet.create({
    HeaderText:{
        fontFamily:"Helvetica",
        fontSize:15
    },
})

export default ImageScreen;