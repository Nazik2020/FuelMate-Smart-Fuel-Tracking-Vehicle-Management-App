// Web Fallback for Station Markers
// react-native-maps is not supported on web

import React from "react";
import { Station } from "./LocationService";

interface StationMarkerProps {
  station: Station;
  isNearest: boolean;
  isSelected: boolean;
  markersReady: boolean;
  onPress: (station: Station) => void;
}

// Return null on web - maps not supported
export const StationMarker: React.FC<StationMarkerProps> = () => null;

interface SearchMarkerProps {
  latitude: number;
  longitude: number;
  name: string;
}

// Return null on web - maps not supported
export const SearchMarker: React.FC<SearchMarkerProps> = () => null;

export default StationMarker;
