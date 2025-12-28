import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface prop {

  name: string,
  value: string,
  date: String,


}

const Rectangle3: React.FC<prop> = ({ name, value, date }) => {

  return (

    <View style={styles.cardR2}>

      <View style={styles.inner}>

        <Text style={styles.text}>{name}</Text>
        <Text style={styles.text2}>{value}</Text>

      </View>

      <View style={styles.inner2}>

        <Text style={styles.textDate}>{date}</Text>


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

  inner2: {

    padding: 14,
  },

  text: {
    fontSize: 16,
    color: "#0D7377", // Green for Station Name
    fontWeight: "600",
    lineHeight: 22,
    margin: 2,
  },

  text2: {
    fontSize: 18,
    color: "#0D7377", // Green for Price
    fontWeight: "bold",
    lineHeight: 22,
  },

  textDate: {
    fontSize: 14,
    color: "#9CA3AF", // Ash/Gray for Date
    lineHeight: 22,
    margin: 2,
    textAlign: "right",
  },

});

export default Rectangle3;

