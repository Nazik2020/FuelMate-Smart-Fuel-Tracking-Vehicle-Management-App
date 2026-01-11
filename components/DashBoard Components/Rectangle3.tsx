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
      {/* Content Container */}
      <View style={styles.contentContainer}>
        <Text style={styles.text}>{name}</Text>
        <Text style={styles.text2}>{value}</Text>
      </View>

      {/* Date Container */}
      <View style={styles.dateContainer}>
        <Text style={styles.textDate}>{date}</Text>
      </View>

    </View>


  );

}

const styles = StyleSheet.create({

  cardR1: {
    backgroundColor: "#F3F4F6", // Light grey background
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
    backgroundColor: "#ffffff", // White background
    borderRadius: 12,           // rounded
    overflow: "hidden",
    shadowColor: "#000",        // shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
    //marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  contentContainer: {
    flex: 1,
  },

  dateContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },

  text: {
    fontSize: 16,
    color: "#4B5563", // Dark grey for Station Name
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 4,
  },

  text2: {
    fontSize: 16,
    color: "#0D7377", // Green for Price
    fontWeight: "bold",
    lineHeight: 22,
  },

  textDate: {
    fontSize: 14,
    color: "#9CA3AF", // Light grey for Date
    lineHeight: 20,
  },

});

export default Rectangle3;

