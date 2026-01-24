import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Platform } from "react-native";

import { auth, db } from "./firebase";

interface UploadResult {
  cancelled: boolean;
  photoURL?: string;
}

const ensureUser = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be signed in to update your profile photo.");
  }

  return user;
};

/**
 * Convert image URI to base64 data URL
 * Works on both web and native platforms
 */
const uriToBase64 = async (uri: string): Promise<string> => {
  // For web: fetch and convert blob to base64
  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // For native: use dynamic import of expo-file-system
  try {
    const FileSystem = await import("expo-file-system");
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("FileSystem error:", error);
    throw new Error("Could not process the image file.");
  }
};

export async function pickAndUploadProfilePhoto(): Promise<UploadResult> {
  const user = ensureUser();

  // Request permission
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permission.status !== "granted") {
    throw new Error("Media access is required to change your profile photo.");
  }

  // Launch image picker with base64 enabled for native
  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.3,
    exif: false,
    base64: Platform.OS !== "web", // Enable base64 on native for fallback
  });

  if (pickerResult.canceled || !pickerResult.assets?.length) {
    return { cancelled: true };
  }

  const asset = pickerResult.assets[0];

  if (!asset.uri) {
    throw new Error("No image was selected. Please try again.");
  }

  try {
    console.log("Processing image...", Platform.OS);

    let photoURL: string;

    // Use built-in base64 from picker if available (native)
    if (asset.base64) {
      const mimeType = asset.mimeType || "image/jpeg";
      photoURL = `data:${mimeType};base64,${asset.base64}`;
      console.log("Using picker base64, length:", photoURL.length);
    } else {
      // Convert URI to base64 (web or fallback)
      photoURL = await uriToBase64(asset.uri);
      console.log("Converted to base64, length:", photoURL.length);
    }

    // Check if base64 is too large for Firestore (max ~1MB document)
    if (photoURL.length > 900000) {
      throw new Error("Image is too large. Please select a smaller photo.");
    }

    // Store in Firestore
    await updateDoc(doc(db, "users", user.uid), {
      photoURL: photoURL,
      updatedAt: serverTimestamp(),
    });
    console.log("Saved to Firestore");

    // Sync to Firebase Auth (optional, may fail for large images)
    try {
      await updateProfile(user, { photoURL: photoURL });
    } catch (error) {
      console.warn("Auth profile sync skipped (image too large for Auth)");
    }

    return { cancelled: false, photoURL };
  } catch (error) {
    console.error("Profile photo failed:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Could not process the selected image. Please try again.");
  }
}
