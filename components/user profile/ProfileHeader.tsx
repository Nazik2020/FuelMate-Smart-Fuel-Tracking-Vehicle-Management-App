import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileHeaderProps {
  name?: string | null;
  memberSince?: string | null;
  onBack?: () => void;
  onEditAvatar?: () => void;
  photoURL?: string | null;
  isUploadingPhoto?: boolean;
}

const resolveName = (value?: string | null) => {
  if (typeof value !== "string") {
    return "Your Profile";
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : "Your Profile";
};

export function ProfileHeader({
  name,
  memberSince,
  onBack,
  onEditAvatar,
  photoURL,
  isUploadingPhoto,
}: ProfileHeaderProps) {
  const displayName = resolveName(name);

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={50} color={Colors.white} />
            )}
            {isUploadingPhoto && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="small" color={Colors.white} />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.editBadge}
            onPress={onEditAvatar}
            disabled={isUploadingPhoto}
            accessibilityRole="button"
            accessibilityLabel="Edit profile photo"
          >
            <Ionicons name="create-outline" size={16} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{displayName}</Text>
        {memberSince && (
          <Text style={styles.subtitle}>Member since {memberSince}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  editBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
});
