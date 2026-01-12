// Re-export from platform-specific files
// React Native will automatically pick .native.tsx on iOS/Android and .web.tsx on web
export {
  MapView,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  WebMapFallback,
} from "./MapView";
