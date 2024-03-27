import React,{useState} from "react";
import {View, StyleSheet, Text, Button, FlatList} from "react-native";



const ColorScreen=()=>{
const [color,setColor]=useState([]);
    return(
        <View>
            <Text>Hi! this is my first random color generator
            </Text>
            <Button title="Add Color" onPress={()=>{setColor([...color,RandomColor()]);
            }}
            />

            
            <FlatList keyExtractor={(item)=>item} data={color} renderItem={({item})=>{
                return <View style={{height:100, width:100, backgroundColor: item }} />            
            }} />

            </View>
            
    )
}

const RandomColor=()=>{
    const red = Math.floor(Math.random()*256);
    const green = Math.floor(Math.random()*256);
    const blue = Math.floor(Math.random()*256);

    return `rgb(${red}, ${green}, ${blue})`;
}

const styles = StyleSheet.create({
    
})

export default ColorScreen;