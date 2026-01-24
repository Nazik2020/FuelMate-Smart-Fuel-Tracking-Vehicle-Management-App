import * as ImagePicker from "expo-image-picker";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Platform } from "react-native";

import { auth, db } from "./firebase";

export interface Vehicle {
  id?: string;
  userId: string;
  name: string;
  vehicleType: string;
  fuelType: "Petrol" | "Diesel";
  licensePlate: string;
  make: string;
  model: string;
  year: string;
  photoURL?: string;
  createdAt?: any;
  updatedAt?: any;
}

const ensureUser = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You need to be signed in to manage vehicles.");
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
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  try {
    const FileSystem = await import("expo-file-system");
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: (FileSystem as any).EncodingType?.Base64 || "base64",
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("FileSystem error:", error);
    throw new Error("Could not process the image file.");
  }
};

/**
 * Pick vehicle image from gallery
 */
export async function pickVehicleImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permission.status !== "granted") {
    throw new Error("Media access is required to upload a vehicle photo.");
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.4,
    exif: false,
    base64: Platform.OS !== "web",
  });

  if (pickerResult.canceled || !pickerResult.assets?.length) {
    return null;
  }

  const asset = pickerResult.assets[0];
  if (!asset.uri) {
    throw new Error("No image was selected.");
  }

  let photoURL: string;

  if (asset.base64) {
    const mimeType = asset.mimeType || "image/jpeg";
    photoURL = `data:${mimeType};base64,${asset.base64}`;
  } else {
    photoURL = await uriToBase64(asset.uri);
  }

  // Check size (Firestore document limit)
  if (photoURL.length > 900000) {
    throw new Error("Image is too large. Please select a smaller photo.");
  }

  return photoURL;
}

/**
 * Remove undefined values from an object (Firestore doesn't accept undefined)
 */
const removeUndefined = <T extends Record<string, any>>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as T;
};

/**
 * Add a new vehicle
 */
export async function addVehicle(
  vehicleData: Omit<Vehicle, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<string> {
  const user = ensureUser();

  const newVehicle = removeUndefined({
    ...vehicleData,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const docRef = await addDoc(collection(db, "vehicles"), newVehicle);
  return docRef.id;
}

/**
 * Get all vehicles for current user
 */
export async function getUserVehicles(): Promise<Vehicle[]> {
  const user = ensureUser();

  const q = query(collection(db, "vehicles"), where("userId", "==", user.uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Vehicle[];
}

/**
 * Update a vehicle
 */
export async function updateVehicle(
  vehicleId: string,
  updates: Partial<Vehicle>,
): Promise<void> {
  ensureUser();

  await updateDoc(
    doc(db, "vehicles", vehicleId),
    removeUndefined({
      ...updates,
      updatedAt: serverTimestamp(),
    }),
  );
}

/**
 * Delete a vehicle
 */
export async function deleteVehicle(vehicleId: string): Promise<void> {
  ensureUser();
  await deleteDoc(doc(db, "vehicles", vehicleId));
}
