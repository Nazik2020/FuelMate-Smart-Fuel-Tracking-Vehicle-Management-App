import { useCurrentUserProfile } from "@/hooks/use-current-user-profile";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import DrawerHeader from "./DrawerMenu/DrawerHeader";
import DrawerMenuItems from "./DrawerMenu/DrawerMenuItems";

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const { width } = useWindowDimensions();
  const drawerWidth = Platform.OS === "web" ? 320 : width * 0.8;

  const slideAnim = React.useRef(new Animated.Value(-drawerWidth)).current;
  const router = useRouter();
  const { displayName, email, profile } = useCurrentUserProfile();

  const handleProfileNavigate = () => {
    onClose();
    router.push("/profile");
  };

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -drawerWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, drawerWidth, slideAnim]);

  React.useEffect(() => {
    slideAnim.setValue(visible ? 0 : -drawerWidth);
  }, [drawerWidth]);

  const drawerContent = (
    <>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.drawer,
          Platform.OS === "web" && styles.drawerWeb,
          {
            width: drawerWidth,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView style={styles.scrollView}>
          <DrawerHeader
            onClose={onClose}
            name={displayName}
            email={email}
            photoURL={profile?.photoURL}
            onProfilePress={handleProfileNavigate}
          />
          <DrawerMenuItems onItemPress={onClose} />
        </ScrollView>
      </Animated.View>
    </>
  );

  // On web, render directly without Modal to stay within the mobile shell
  if (Platform.OS === "web") {
    if (!visible) return null;
    return <View style={styles.webContainer}>{drawerContent}</View>;
  }

  // On native, use Modal
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>{drawerContent}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    borderRadius: 36,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  drawerWeb: {
    borderTopLeftRadius: 36,
    borderBottomLeftRadius: 36,
  },
  scrollView: {
    flex: 1,
  },
});
