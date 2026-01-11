import React, { useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

// Full year data for reference (you can replace this with actual data from your database)
const fullYearData = [
  { value: 1000, label: "Jan", monthIndex: 0 },
  { value: 1500, label: "Feb", monthIndex: 1 },
  { value: 900, label: "Mar", monthIndex: 2 },
  { value: 800, label: "Apr", monthIndex: 3 },
  { value: 3000, label: "May", monthIndex: 4 },
  { value: 4000, label: "Jun", monthIndex: 5 },
  { value: 2500, label: "Jul", monthIndex: 6 },
  { value: 3800, label: "Aug", monthIndex: 7 },
  { value: 4000, label: "Sep", monthIndex: 8 },
  { value: 2800, label: "Oct", monthIndex: 9 },
  { value: 5600, label: "Nov", monthIndex: 10 },
  { value: 3850, label: "Dec", monthIndex: 11 },
];

export default function CardMExpense() {

  // Generate data for current month + previous 6 months (7 months total)
  const data = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const result = [];
    // Loop from 6 months ago to current month (inclusive) - total 7 months
    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      
      // Find data for this month from fullYearData
      const monthData = fullYearData.find(d => d.monthIndex === monthIndex) || { value: 0, label: monthLabels[monthIndex] };
      result.push({
        value: monthData.value,
        label: monthLabels[monthIndex],
      });
    }
    
    return result;
  }, []);

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
