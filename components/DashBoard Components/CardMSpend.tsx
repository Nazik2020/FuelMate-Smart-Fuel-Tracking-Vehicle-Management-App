import React from "react";
import { View, Text,StyleSheet } from "react-native";


export default function CardMSpend() {

    return (

        <View style = {styles.cardS}>

            <View style={styles.inner}>

                <Text style={styles.text}>This Month's Spend</Text>
                <Text style={styles.text2}>$185.50</Text>
                <Text style={styles.text}>vs.$172.30 last month</Text>

            </View>

        </View>


    );

}

const styles = StyleSheet.create({

    cardS: {
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

  inner: {
    padding: 14, // p-6
  },
  
  text: {
    fontSize: 15,
    color: "#074396ff", // text-slate-500
    lineHeight: 22,
    margin:5,
  },

  text2: {
    fontSize: 30,
    color: "#074396ff", // text-slate-500
    lineHeight: 22,
  },

});

