import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface prop {

  title: string,
  value: string

}

const Rectangle2: React.FC<prop> = ({ title, value }) => {
  // Determine icon based on title
  const getIcon = () => {
    if (title.toLowerCase().includes("efficiency")) {
      return "trending-up";
    } else if (title.toLowerCase().includes("fill")) {
      return "time-outline";
    }
    return "information-circle-outline";
  };

  return (

    <View style={styles.cardR1}>

      <View style={styles.inner}>
        <View style={styles.iconContainer}>
          <Ionicons name={getIcon() as any} size={20} color="#0D7377" />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>{title}</Text>
          <Text style={styles.text2}>{value}</Text>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E6F7F8", // Light teal background
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  contentContainer: {
    flex: 1,
  },

  text: {
    fontSize: 14,
    color: "#6B7280", // Grey for label
    lineHeight: 20,
    marginBottom: 4,
  },

  text2: {
    fontSize: 18,
    color: "#1F2937", // Dark grey for value
    fontWeight: "bold",
    lineHeight: 24,
  },

});

export default Rectangle2;

