import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface prop {

  title: string,
  value: string

}

const Rectangle2: React.FC<prop> = ({ title, value }) => {

  return (

    <View style={styles.cardR1}>

      <View style={styles.inner}>

        <Text style={styles.text}>{title}</Text>
        <Text style={styles.text2}>{value}</Text>

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

  inner: {
    padding: 14, // p-6
  },

  text: {
    fontSize: 15,
    color: "#9CA3AF", // Ash/Gray for label
    lineHeight: 22,
    margin: 2,
  },

  text2: {
    fontSize: 20,
    color: "#0D7377", // Green for value
    fontWeight: "bold",
    lineHeight: 22,
  },

});

export default Rectangle2;

