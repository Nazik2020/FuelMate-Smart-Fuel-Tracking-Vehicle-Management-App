import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
            barWidth={32}
            spacing={20}
            frontColor="#0D7377"
            barBorderTopLeftRadius={4}
            barBorderTopRightRadius={4}
            xAxisLabelTextStyle={{ color: "#6B7280", fontSize: 12 }}
            yAxisTextStyle={{ color: "#6B7280", fontSize: 12 }}
            xAxisThickness={0}
            yAxisThickness={0}
            hideRules
            showLine={false}
            initialSpacing={10}
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
