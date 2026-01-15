// TypeScript helper file for MapView exports
// At runtime, Metro will use MapView.native.tsx on iOS/Android
// and MapView.web.tsx on web. This file simply re-exports the
// native version so TypeScript has concrete definitions.

export {
  MapView,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  WebMapFallback,
} from "./MapView.native";
