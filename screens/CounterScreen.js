import React,{useState} from "react";
import{Button, View, StyleSheet, Text} from "react-native";

const CounterScreen=()=>{
    const [UseCounter, SetCounter] = useState(0);
    return(
        <View>
            <Button title="Increase" onPress={()=>{
                SetCounter(UseCounter+1);
            }} />
            <Button title="Decrease" onPress={()=>{
                SetCounter(UseCounter-1);
            }} />
            <Text>Current Count: {UseCounter}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    
})

export default CounterScreen;