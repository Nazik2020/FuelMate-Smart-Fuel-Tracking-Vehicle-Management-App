import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  thisMonth: number;
  lastMonth: number;
}

export default function CardMSpend({ thisMonth, lastMonth }: Props) {
  return (
    <View style={styles.cardS}>
      <View style={styles.inner}>
        <Text style={styles.text}>This Month's Spend</Text>
        <Text style={styles.text2}>Rs {thisMonth.toFixed(2)}</Text>
        <Text style={styles.text}>
          vs. Rs {lastMonth.toFixed(2)} last month
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardS: {
    backgroundColor: "#E6F7F8",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  inner: { padding: 14 },
  text: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  text2: {
    fontSize: 32,
    color: "#0D7377",
    fontWeight: "bold",
    marginBottom: 6,
  },
});
