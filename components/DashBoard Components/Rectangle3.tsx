import React from "react";
import { View, Text,StyleSheet } from "react-native";

interface prop{

    name:string,
    value:string,
    date:String,
    

}

const Rectangle3: React.FC<prop>=({name,value,date})=> {

    return (

        <View style = {styles.cardR2}>

            <View style={styles.inner}>

                <Text style={styles.text}>{name}</Text>
                <Text style={styles.text2}>{value}</Text>

            </View>

            <View style={styles.inner2}>

                <Text style={styles.text}>{date}</Text>
                

            </View>

        </View>


    );

}

const styles = StyleSheet.create({

    cardR1: {
    backgroundColor: "#ffffff", // bg-white
    borderRadius: 12,           // rounded
    overflow: "hidden",
    shadowColor: "#000",        // shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
    //marginVertical: 10,
    
  },
    cardR2: {
    backgroundColor: "#ffffff", // bg-white
    borderRadius: 12,           // rounded
    overflow: "hidden",
    shadowColor: "#000",        // shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
    //marginVertical: 10,
     flexDirection: "row",
     justifyContent: "space-between",
    
  },

  inner: {
    padding: 14, // p-6
  },

  inner2:{
    
     padding: 14,
  },
  
  text: {
    fontSize: 15,
    color: "#074396ff", // text-slate-500
    lineHeight: 22,
    margin:2,
  },

  text2: {
    fontSize: 20,
    color: "#074396ff", // text-slate-500
    lineHeight: 22,
  },

});

export default Rectangle3;

