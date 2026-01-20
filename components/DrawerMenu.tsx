import { useCurrentUserProfile } from "@/hooks/use-current-user-profile";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DrawerHeader from "./DrawerMenu/DrawerHeader";
import DrawerMenuItems from "./DrawerMenu/DrawerMenuItems";

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const router = useRouter();
  const { displayName, email } = useCurrentUserProfile();

  const handleProfileNavigate = () => {
    onClose();
    router.push("/profile");
  };

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ScrollView style={styles.scrollView}>
            <DrawerHeader
              onClose={onClose}
              name={displayName}
              email={email}
              onProfilePress={handleProfileNavigate}
            />
            <DrawerMenuItems onItemPress={onClose} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: DRAWER_WIDTH,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
});
