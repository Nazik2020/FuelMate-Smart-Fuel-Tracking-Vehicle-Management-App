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
 */
const uriToBase64 = async (uri: string): Promise<string> => {
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

  try {
    const FileSystem = await import("expo-file-system");
    const base64 = await FileSystem.default.readAsStringAsync(uri, {
      encoding: "base64",
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    throw new Error("Could not process the image file.");
  }
};

export async function pickAndUploadProfilePhoto(): Promise<UploadResult> {
  const user = ensureUser();

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permission.status !== "granted") {
    throw new Error("Media access is required to change your profile photo.");
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.3,
    exif: false,
    base64: Platform.OS !== "web",
  });

  if (pickerResult.canceled || !pickerResult.assets?.length) {
    return { cancelled: true };
  }

  const asset = pickerResult.assets[0];

  if (!asset.uri) {
    throw new Error("No image was selected. Please try again.");
  }

  try {
    let photoURL: string;

    if (asset.base64) {
      const mimeType = asset.mimeType || "image/jpeg";
      photoURL = `data:${mimeType};base64,${asset.base64}`;
    } else {
      photoURL = await uriToBase64(asset.uri);
    }

    if (photoURL.length > 900000) {
      throw new Error("Image is too large. Please select a smaller photo.");
    }

    await updateDoc(doc(db, "users", user.uid), {
      photoURL: photoURL,
      updatedAt: serverTimestamp(),
    });

    try {
      await updateProfile(user, { photoURL: photoURL });
    } catch (error) {
      // Auth profile sync skipped for large images
    }

    return { cancelled: false, photoURL };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Could not process the selected image. Please try again.");
  }
}
