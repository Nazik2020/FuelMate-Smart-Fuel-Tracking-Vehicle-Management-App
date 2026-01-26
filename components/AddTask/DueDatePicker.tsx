import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DueDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
}

export default function DueDatePicker({ value, onChange, label = "Due Date" }: DueDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
    }
    if (Platform.OS === "ios" && selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "mm/dd/yyyy";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleConfirmIOS = () => {
    setShowPicker(false);
  };

  if (Platform.OS === "web") {
    // Format date for HTML input (YYYY-MM-DD)
    const dateValue = value ? value.toISOString().split('T')[0] : '';

    // Web-specific styling
    const webInputStyle = {
      width: '100%',
      height: 48,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      padding: 10,
      fontSize: 16,
      color: Colors.text,
      backgroundColor: Colors.white,
      fontFamily: 'sans-serif',
      outline: 'none',
      boxSizing: 'border-box',
    };

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        {/* @ts-ignore - React Native Web supports createElement for DOM nodes */}
        {React.createElement('input', {
          type: 'date',
          value: dateValue,
          onChange: (e: any) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            onChange(date);
          },
          style: webInputStyle,
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dateText, !value && styles.placeholder]}>
          {formatDate(value)}
        </Text>
        <Ionicons
          name="calendar-outline"
          size={22}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      {showPicker && (
        <>
          {Platform.OS === "ios" ? (
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.iosPickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmIOS}>
                  <Text style={styles.iosPickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            </View>
          ) : (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    backgroundColor: Colors.white,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
    ...Platform.select({
      ios: { fontFamily: "System" },
      android: { fontFamily: "sans-serif" },
      web: { fontFamily: "sans-serif" }, // Ensure web also uses sans-serif if not using the special web input
    }),
  },
  placeholder: {
    color: Colors.textLight,
  },
  iosPickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  iosPickerCancel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  iosPickerDone: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
});
