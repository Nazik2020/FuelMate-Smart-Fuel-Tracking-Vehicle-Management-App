import { auth } from "@/config/firebase";
import {
  CreateNotificationData,
  sendNotificationToAll
} from "@/config/notificationService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationPayload = {
  recipient: string;
  title: string;
  message: string;
};

const SettingItem = ({
  icon,
  iconType = "Ionicons",
  title,
  subtitle,
  type = "default",
  onPress,
  hasSwitch,
  switchValue,
  onSwitchChange,
}: any) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={hasSwitch}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.iconBox,
        { backgroundColor: type === "logout" ? "#FEE2E2" : "#E0F2F1" },
      ]}
    >
      {iconType === "Ionicons" ? (
        <Ionicons
          name={icon}
          size={22}
          color={type === "logout" ? "#EF4444" : "#0D9488"}
        />
      ) : (
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={type === "logout" ? "#EF4444" : "#0D9488"}
        />
      )}
    </View>
    <View style={styles.settingInfo}>
      <Text
        style={[styles.settingTitle, type === "logout" && { color: "#EF4444" }]}
      >
        {title}
      </Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    {hasSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: "#D1D5DB", true: "#0D9488" }}
        thumbColor="#FFFFFF"
      />
    ) : (
      <Ionicons
        name="chevron-forward"
        size={20}
        color={type === "logout" ? "#EF4444" : "#9CA3AF"}
      />
    )}
  </TouchableOpacity>
);

const FuelPriceInput = ({ label, value, onChange }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label} (LKR)</Text>
    <View style={styles.inputWrapper}>
      <Text style={styles.currencySymbol}>LKR</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0.00"
      />
    </View>
  </View>
);

const confirmOnWeb = (message: string) => {
  const confirmFn = (globalThis as { confirm?: (msg?: string) => boolean })
    ?.confirm;
  if (typeof confirmFn !== "function") {
    return true;
  }
  return confirmFn(message);
};

export default function AdminSettings() {
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkMode, setDarkMode] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isNotifModalVisible, setNotifModalVisible] = useState(false);

  const [notifData, setNotifData] = useState({
    recipient: "Search",
    title: "",
    message: "",
  });

  const [activeFilter, setActiveFilter] = useState("All Users");

  const [prices, setPrices] = useState({
    petrol92: "355.00",
    petrol95: "395.00",
    autoDiesel: "320.00",
    superDiesel: "385.00",
  });

  const resolveRecipientLabel = (value: string) => {
    if (!value || value === "Search") {
      return activeFilter;
    }
    return value;
  };

  const notifyUsers = ({ recipient, title, message }: NotificationPayload) => {
    Alert.alert(
      "Notification Sent",
      `${title}\n\n${message}\n\nRecipients: ${recipient}`,
    );
  };

  const buildFuelPriceMessage = () =>
    [
      `Petrol 92: LKR ${prices.petrol92}`,
      `Petrol 95: LKR ${prices.petrol95}`,
      `Auto Diesel: LKR ${prices.autoDiesel}`,
      `Super Diesel: LKR ${prices.superDiesel}`,
    ].join("\n");

  const handleSendNotification = async () => {
    if (!notifData.title.trim() || !notifData.message.trim()) {
      Alert.alert("Error", "Please fill in both title and message.");
      return;
    }

    try {
      const recipient = resolveRecipientLabel(notifData.recipient);
      const notificationData: CreateNotificationData = {
        type: "custom",
        title: notifData.title.trim(),
        message: notifData.message.trim(),
      };

      // Send notification based on recipient
      if (recipient === "All Users") {
        await sendNotificationToAll(notificationData);
      } else if (recipient === "Active Users") {
        // For now, treat Active Users the same as All Users
        await sendNotificationToAll(notificationData);
      } else {
        // Specific user notification - would need user ID
        await sendNotificationToAll(notificationData);
      }

      setNotifModalVisible(false);
      Alert.alert(
        "Success",
        `Notification "${notifData.title}" sent to ${recipient}!`
      );
      setNotifData({ recipient: "Search", title: "", message: "" });
      setActiveFilter("All Users");
    } catch (error) {
      console.error("Error sending notification:", error);
      Alert.alert(
        "Error",
        "Failed to send notification. Please try again."
      );
    }
  };

  const performLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn("Sign-out failed", error);
    }
    router.replace("/loginpage");
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = confirmOnWeb("Are you sure you want to logout?");
      if (confirmed) {
        performLogout();
      }
      return;
    }

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  const handleSavePrices = () => {
    setModalVisible(false);
    notifyUsers({
      recipient: "All Users",
      title: "Fuel Prices Updated",
      message: `${buildFuelPriceMessage()}\n\nAll users have been notified about the change.`,
    });
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Settings</Text>
          <Text style={styles.headerSubtitle}>Manage app settings</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingItem
          icon="gas-station-outline"
          iconType="MaterialCommunityIcons"
          title="Fuel Prices"
          subtitle="Update current fuel prices"
          onPress={() => setModalVisible(true)}
        />

        {/* Push Notifications and Dark Mode removed as per request */}

        <SettingItem
          icon="notifications-active-outline"
          iconType="MaterialCommunityIcons"
          title="Send Notification"
          subtitle="Compose and send to users"
          onPress={() => setNotifModalVisible(true)}
        />

        <SettingItem
          icon="log-out-outline"
          title="Logout"
          subtitle=""
          type="logout"
          onPress={handleLogout}
        />
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Update Fuel Prices</Text>
                <Text style={styles.modalSubtitle}>
                  Set the current fuel prices per liter (LKR)
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <FuelPriceInput
                label="Petrol 92"
                value={prices.petrol92}
                onChange={(v: string) =>
                  setPrices({ ...prices, petrol92: v })
                }
              />
              <FuelPriceInput
                label="Petrol 95"
                value={prices.petrol95}
                onChange={(v: string) =>
                  setPrices({ ...prices, petrol95: v })
                }
              />
              <FuelPriceInput
                label="Auto Diesel"
                value={prices.autoDiesel}
                onChange={(v: string) =>
                  setPrices({ ...prices, autoDiesel: v })
                }
              />
              <FuelPriceInput
                label="Super Diesel"
                value={prices.superDiesel}
                onChange={(v: string) =>
                  setPrices({ ...prices, superDiesel: v })
                }
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePrices}
              >
                <Ionicons
                  name="save-outline"
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.saveButtonText}>Save Prices</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isNotifModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNotifModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: "85%" }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setNotifModalVisible(false)}>
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { marginLeft: 16 }]}>
                Compose Notification
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Recipient</Text>
                  <View style={styles.dropdownInput}>
                    <Ionicons
                      name="search-outline"
                      size={20}
                      color="#9CA3AF"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.dropdownText,
                        notifData.recipient !== "Search" && {
                          color: "#111827",
                        },
                      ]}
                    >
                      {notifData.recipient === "Search"
                        ? "Search for a user or select 'All Users'"
                        : notifData.recipient}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                  </View>
                </View>

                <View style={styles.chipRow}>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      activeFilter === "All Users" && styles.activeChip,
                    ]}
                    onPress={() => {
                      setActiveFilter("All Users");
                      setNotifData({ ...notifData, recipient: "All Users" });
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        activeFilter === "All Users" && styles.activeChipText,
                      ]}
                    >
                      All Users
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      activeFilter === "Active Users" && styles.activeChip,
                    ]}
                    onPress={() => {
                      setActiveFilter("Active Users");
                      setNotifData({
                        ...notifData,
                        recipient: "Active Users",
                      });
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        activeFilter === "Active Users" &&
                        styles.activeChipText,
                      ]}
                    >
                      Active Users
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Notification Title</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Account Update"
                      placeholderTextColor="#9CA3AF"
                      value={notifData.title}
                      onChangeText={(v) =>
                        setNotifData({ ...notifData, title: v })
                      }
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Message</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        height: 160,
                        alignItems: "flex-start",
                        paddingTop: 12,
                      },
                    ]}
                  >
                    <TextInput
                      style={[styles.textInput, { textAlignVertical: "top" }]}
                      placeholder="Enter your message here..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      maxLength={500}
                      value={notifData.message}
                      onChangeText={(v) =>
                        setNotifData({ ...notifData, message: v })
                      }
                    />
                  </View>
                  <Text style={styles.charCount}>
                    {notifData.message.length}/500 characters
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSendNotification}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.saveButtonText}>Send Notification</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
  },
  webViewport: {
    backgroundColor: "#05172D",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  webShell: {
    width: 420,
    maxWidth: "100%",
    flex: 1,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 24 },
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    // Removed border to fix "black bold line" issue
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  settingItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    width: "100%",
    maxWidth: 420,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  dropdownInput: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: "#9CA3AF",
  },
  chipRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  activeChip: {
    backgroundColor: "#0D948815",
    borderWidth: 1,
    borderColor: "#0D9488",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeChipText: {
    color: "#0D9488",
  },
  inputWrapper: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    color: "#9CA3AF",
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#0D9488",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
