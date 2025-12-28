import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export default function CardMExpense() {

  const data = [
    { value: 1000, label: "Jan" },
    { value: 1500, label: "Feb" },
    { value: 900, label: "Mar" },
    { value: 800, label: "Apr" },
    { value: 3000, label: "May" },
    { value: 4000, label: "Jun" },
    { value: 2500, label: "Jul" },
    { value: 3800, label: "Aug" },
    { value: 4000, label: "Sep" },
    { value: 2800, label: "Oct" },
    { value: 5600, label: "Nov" },
    { value: 3850, label: "Dec" },
  ];

  return (
    <View style={styles.cardS}>
      <View style={styles.inner}>
        <Text style={styles.text}>Monthly Expense</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={data}
            height={150}
            barWidth={30}          // increased for better scrolling
            spacing={20}           // spacing between bars
            frontColor="#1558b6ff"
            xAxisLabelTextStyle={{ color: "#074396ff", fontSize: 12 }}
            showLine={false}
            initialSpacing={0}
          />
        </ScrollView>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardS: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    margin: 10,
  },

  inner: {
    padding: 14,
  },

  text: {
    fontSize: 15,
    color: "#074396ff",
    marginBottom: 10,
  },
});
