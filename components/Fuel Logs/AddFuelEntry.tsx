import { DueDatePicker } from "@/components/AddTask";
import { addFuelLog } from "@/config/fuelLogService";
import { FuelPrices, getFuelPrices } from "@/config/fuelPriceService";
import { getUserVehicles, Vehicle } from "@/config/vehicleService";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddFuelEntry() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [fuelPrices, setFuelPrices] = useState<FuelPrices | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    // Inputs
    const [fuelAmountRs, setFuelAmountRs] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [station, setStation] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());

    // Calculated
    const [calculatedLiters, setCalculatedLiters] = useState("0");
    const [estimatedRange, setEstimatedRange] = useState("0km - 0km");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
    const [showFuelTypeDropdown, setShowFuelTypeDropdown] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    // Recalculate when inputs change
    useEffect(() => {
        calculateMetrics();
    }, [fuelAmountRs, fuelType, selectedVehicle, fuelPrices]);

    const loadData = async () => {
        try {
            const [userVehicles, prices] = await Promise.all([
                getUserVehicles(),
                getFuelPrices()
            ]);

            setVehicles(userVehicles);
            setFuelPrices(prices);

            if (userVehicles.length > 0) {
                // Default to first vehicle
                handleVehicleSelect(userVehicles[0]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVehicleSelect = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setShowVehicleDropdown(false);
        setFuelType(""); // Reset fuel type when vehicle changes
    };

    const getFuelTypeOptions = () => {
        if (!selectedVehicle) return [];

        if (selectedVehicle.fuelType === "Petrol") {
            return ["Petrol 92 Octane", "Petrol 95 Octane"];
        } else if (selectedVehicle.fuelType === "Diesel") {
            return ["Auto Diesel", "Super Diesel"];
        }
        return [];
    };

    const getPricePerLiter = (type: string): number => {
        if (!fuelPrices) return 0;

        switch (type) {
            case "Petrol 92 Octane": return parseFloat(fuelPrices.petrol92);
            case "Petrol 95 Octane": return parseFloat(fuelPrices.petrol95);
            case "Auto Diesel": return parseFloat(fuelPrices.autoDiesel);
            case "Super Diesel": return parseFloat(fuelPrices.superDiesel);
            default: return 0;
        }
    };

    const getVehicleEfficiency = (vehicle: Vehicle): number => {
        // Mock efficiency based on vehicle type if not available
        // In a real app, this might be stored in the vehicle document
        const type = vehicle.vehicleType?.toLowerCase() || "";
        if (type.includes("car")) return 12; // 12 km/l
        if (type.includes("bike") || type.includes("motorcycle")) return 45; // 45 km/l
        if (type.includes("van")) return 10; // 10 km/l
        if (type.includes("suv")) return 8; // 8 km/l
        if (type.includes("truck")) return 6; // 6 km/l
        return 12; // Default
    };

    const calculateMetrics = () => {
        if (!fuelAmountRs || !fuelType || !selectedVehicle) {
            setCalculatedLiters("0");
            setEstimatedRange("0km - 0km");
            return;
        }

        const price = getPricePerLiter(fuelType);
        const amount = parseFloat(fuelAmountRs);

        if (price > 0 && amount > 0) {
            const liters = amount / price;
            setCalculatedLiters(liters.toFixed(2));

            const efficiency = getVehicleEfficiency(selectedVehicle);
            const range = Math.round(liters * efficiency);

            // Show a range (e.g. +/- 10%)
            const minRange = Math.round(range * 0.9);
            const maxRange = Math.round(range * 1.1);
            setEstimatedRange(`${minRange}km - ${maxRange}km`);
        } else {
            setCalculatedLiters("0");
            setEstimatedRange("0km - 0km");
        }
    };

    const handleSave = async () => {
        if (!selectedVehicle || !fuelAmountRs || !fuelType || !date) {
            Alert.alert("Missing Info", "Please fill in all required fields.");
            return;
        }

        setSaving(true);
        try {
            await addFuelLog({
                vehicleId: selectedVehicle.id || "",
                vehicleName: selectedVehicle.name,
                fuelAmountRs: parseFloat(fuelAmountRs),
                fuelLiters: parseFloat(calculatedLiters),
                fuelType,
                station: station || "Unknown Station",
                date: date,
                estimatedRange
            });

            Alert.alert("Success", "Fuel entry saved successfully!", [
                { text: "OK", onPress: () => router.push("/") }
            ]);

            // Reset form
            setFuelAmountRs("");
            setStation("");
        } catch (error) {
            console.error("Error saving fuel log:", error);
            Alert.alert("Error", "Failed to save entry. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add new Fuel Entry</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>

                {/* Vehicle Selection */}
                <View style={styles.fullInput}>
                    <Text style={styles.label}>Select Vehicle</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowVehicleDropdown(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.dropdownText,
                            !selectedVehicle && { color: Colors.textSecondary }
                        ]}>
                            {selectedVehicle
                                ? `${selectedVehicle.name} (${selectedVehicle.licensePlate})`
                                : "Select your vehicle"}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Row 1: Amount & Fuel Type */}
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Fuel Amount (Rs)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g, 500"
                            placeholderTextColor={Colors.textSecondary}
                            keyboardType="numeric"
                            value={fuelAmountRs}
                            onChangeText={setFuelAmountRs}
                        />
                        {parseFloat(calculatedLiters) > 0 && (
                            <Text style={styles.helperText}>
                                ≈ {calculatedLiters} Liters
                            </Text>
                        )}
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>{selectedVehicle?.fuelType || "Fuel"} Type</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => selectedVehicle && setShowFuelTypeDropdown(true)}
                            disabled={!selectedVehicle}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{
                                    color: fuelType ? Colors.text : Colors.textSecondary,
                                    fontSize: 16,
                                    flex: 1
                                }} numberOfLines={1}>
                                    {fuelType || "Select Type"}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                        {fuelType !== "" && (
                            <Text style={styles.helperText}>
                                @ Rs {getPricePerLiter(fuelType)}/L
                            </Text>
                        )}
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
                <View style={[styles.fullInput, { zIndex: 10 }]}>
                    <DueDatePicker
                        value={date}
                        onChange={setDate}
                        label="Date"
                    />
                </View>
            </View>

            {/* Estimate Range Card */}
            <View style={styles.estimateCard}>
                <Text style={styles.estimateLabel}>Estimate Range</Text>
                <Text style={styles.estimateValue}>{estimatedRange}</Text>
                <Text style={styles.estimateSubtext}>
                    Based on {selectedVehicle?.name || "your vehicle"}'s consumption
                    {"\n"}
                    (~{getVehicleEfficiency(selectedVehicle || {} as any)} km/L)
                </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator color={Colors.white} />
                ) : (
                    <Text style={styles.saveButtonText}>Save Entry</Text>
                )}
            </TouchableOpacity>

            {/* Bottom Padding */}
            <View style={{ height: 40 }} />

            {/* Vehicle Selection Modal */}
            <Modal
                visible={showVehicleDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowVehicleDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowVehicleDropdown(false)}
                >
                    <View style={styles.dropdownModal}>
                        <Text style={styles.modalTitle}>Select Vehicle</Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {vehicles.map((vehicle) => (
                                <TouchableOpacity
                                    key={vehicle.id}
                                    style={[
                                        styles.dropdownOption,
                                        selectedVehicle?.id === vehicle.id && styles.selectedOption
                                    ]}
                                    onPress={() => handleVehicleSelect(vehicle)}
                                >
                                    <View>
                                        <Text style={[
                                            styles.optionTitle,
                                            selectedVehicle?.id === vehicle.id && styles.selectedOptionText
                                        ]}>
                                            {vehicle.name}
                                        </Text>
                                        <Text style={styles.optionSubtitle}>
                                            {vehicle.licensePlate} • {vehicle.fuelType}
                                        </Text>
                                    </View>
                                    {selectedVehicle?.id === vehicle.id && (
                                        <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                            {vehicles.length === 0 && (
                                <Text style={{ padding: 20, textAlign: "center", color: Colors.textSecondary }}>
                                    No vehicles found. Please add a vehicle first.
                                </Text>
                            )}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Fuel Type Selection Modal */}
            <Modal
                visible={showFuelTypeDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowFuelTypeDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowFuelTypeDropdown(false)}
                >
                    <View style={styles.dropdownModal}>
                        <Text style={styles.modalTitle}>Select Fuel Type</Text>
                        <View>
                            {getFuelTypeOptions().map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={styles.dropdownOption}
                                    onPress={() => {
                                        setFuelType(type);
                                        setShowFuelTypeDropdown(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionTitle,
                                        fuelType === type && { color: Colors.primary, fontWeight: "bold" }
                                    ]}>
                                        {type}
                                    </Text>
                                    {fuelType === type && (
                                        <Ionicons name="checkmark" size={20} color={Colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
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
    backButton: {},
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
        color: "#9CA3AF",
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
        justifyContent: "center", // For TouchableOpacity inputs
    },
    dropdownButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === "ios" ? 14 : 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownText: {
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
        color: "#9CA3AF",
        marginBottom: 8,
    },
    estimateValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0D7377",
        marginBottom: 4,
    },
    estimateSubtext: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    saveButton: {
        backgroundColor: "#0D7377",
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    dropdownModal: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        width: "90%", // Responsive width
        maxWidth: 340, // Max width for tablet/web
        padding: 20,
        maxHeight: "60%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text,
        marginBottom: 16,
    },
    dropdownOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    selectedOption: {
        backgroundColor: "#F0FDFA", // Light teal bg
    },
    optionTitle: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: "500",
    },
    selectedOptionText: {
        color: Colors.primary,
        fontWeight: "600",
    },
    optionSubtitle: {
        fontSize: 13,
        color: "#9CA3AF",
        marginTop: 2,
    },
    helperText: {
        fontSize: 12,
        color: "#6B7280", // Gray-500
        marginTop: 4,
        fontWeight: "500",
    },
});
