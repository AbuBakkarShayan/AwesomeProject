import React from "react";
import { View,StyleSheet, Text, Image } from "react-native";

const ImageDetail = (props)=>{
    <Text style={styles.textStyle}>Hi I am Image Detail Screen</Text>
    return(
        <View>  
            <Image style={styles.image} source={props.typeOfImage} />
            <Text style={styles.textPropStyle}>{props.title}</Text>
            <Text>Image Score - {props.imageScore}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    textStyle:{
        fontSize:80,
        color:"Black"
    },
   image:{
    width:100,
    height: 100,
   },
   textPropStyle:{
    fontSize:15
   }
})

export default ImageDetail;