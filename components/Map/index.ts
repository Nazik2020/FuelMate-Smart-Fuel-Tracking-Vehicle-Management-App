// Shared TypeScript entry for Map components.
// Native bundles use index.native.ts, web bundles use index.web.ts.
// This fallback points to the web-safe implementation to avoid
// importing native-only modules when accidentally resolved on web.
export {
  MapView,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  WebMapFallback,
} from "./MapView.web";
