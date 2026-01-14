// Native implementation for react-native-maps
// This file is used on iOS and Android

import MapViewNative, {
  Marker as MarkerNative,
  Polyline as PolylineNative,
  PROVIDER_GOOGLE as PROVIDER_GOOGLE_NATIVE,
} from "react-native-maps";

export const MapView = MapViewNative;
export const Marker = MarkerNative;
export const Polyline = PolylineNative;
export const PROVIDER_GOOGLE = PROVIDER_GOOGLE_NATIVE;

export function WebMapFallback() {
  // This won't be used on native, but we need to export it for consistency
  return null;
}
