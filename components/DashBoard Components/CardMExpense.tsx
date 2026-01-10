import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface BarData {
  value: number;
  label: string;
}

interface CardMExpenseProps {
  data: BarData[];
}

export default function CardMExpense({ data }: CardMExpenseProps) {
  return (
    <View style={styles.cardS}>
      <View style={styles.inner}>
        <Text style={styles.text}>Monthly Expense</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={data}
            height={150}
            barWidth={30}          // width of each bar
            spacing={20}           // space between bars
            frontColor="#0D7377"
            xAxisLabelTextStyle={{ color: "#0D7377", fontSize: 12 }}
            yAxisTextStyle={{ color: "#9CA3AF" }}
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
    color: "#0d7377",
    marginBottom: 10,
  },
});
