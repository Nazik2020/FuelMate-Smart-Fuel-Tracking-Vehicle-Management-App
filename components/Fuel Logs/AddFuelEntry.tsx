import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddFuelEntry() {
    const [fuelAmount, setFuelAmount] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [station, setStation] = useState("");
    const [date, setDate] = useState("");

    const handleSave = () => {
        // Logic to save entry would go here
        console.log("Saving entry...");
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add new Fuel Entry</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                {/* Row 1: Amount & Cost */}
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Fuel Amount (L)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g, 40.5"
                            placeholderTextColor={Colors.textSecondary}
                            keyboardType="numeric"
                            value={fuelAmount}
                            onChangeText={setFuelAmount}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Total Cost (Rs)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g, Rs 55.20"
                            placeholderTextColor={Colors.textSecondary}
                            keyboardType="numeric"
                            value={totalCost}
                            onChangeText={setTotalCost}
                        />
                    </View>
                </View>

                {/* Row 2: Station */}
                <View style={styles.fullInput}>
                    <Text style={styles.label}>Fuel Station</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g, Shell on main St"
                        placeholderTextColor={Colors.textSecondary}
                        value={station}
                        onChangeText={setStation}
                    />
                </View>

                {/* Row 3: Date */}
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g, 10/27/2023"
                            placeholderTextColor={Colors.textSecondary}
                            value={date}
                            onChangeText={setDate}
                        />
                    </View>
                </View>
            </View>

            {/* Estimate Range Card */}
            <View style={styles.estimateCard}>
                <Text style={styles.estimateLabel}>Estimate Range</Text>
                <Text style={styles.estimateValue}>330 - 500 km</Text>
                <Text style={styles.estimateSubtext}>
                    Based on your average consumption
                </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>

            {/* Bottom Padding */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC", // Light background
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    backButton: {
        // padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.text,
    },
    formContainer: {
        gap: 16,
    },
    row: {
        flexDirection: "row",
        gap: 16,
    },
    halfInput: {
        flex: 1,
    },
    fullInput: {
        width: "100%",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#9CA3AF", // Ash color as requested
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === "ios" ? 14 : 10,
        fontSize: 16,
        color: Colors.text,
    },
    estimateCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    estimateLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#9CA3AF", // Ash
        marginBottom: 8,
    },
    estimateValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0D7377", // Green
        marginBottom: 4,
    },
    estimateSubtext: {
        fontSize: 14,
        color: "#9CA3AF", // Ash
    },
    saveButton: {
        backgroundColor: "#0D7377", // Green
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0D7377",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
