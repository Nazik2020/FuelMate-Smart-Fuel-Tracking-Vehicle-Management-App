import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UploadPhotoProps {
  photoURL?: string | null;
  onChoose?: () => void;
}

export function UploadPhoto({ photoURL, onChoose }: UploadPhotoProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dashedCircle}
        onPress={onChoose}
        accessibilityRole="button"
      >
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.image} />
        ) : (
          <Ionicons name="camera-outline" size={36} color={Colors.gray} />
        )}
      </TouchableOpacity>
      <Text style={styles.title}>Upload Vehicle Photo</Text>
      <TouchableOpacity onPress={onChoose} accessibilityRole="button">
        <Text style={styles.link}>
          {photoURL ? "Change Photo" : "Choose from Gallery"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  dashedCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#D5D9E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  link: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
});
