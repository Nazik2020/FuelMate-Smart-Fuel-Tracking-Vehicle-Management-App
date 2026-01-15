// StationMarker component - Platform specific exports
// Metro bundler uses .native.tsx on iOS/Android and .web.tsx on web
// This file exists for TypeScript type resolution

// Re-export everything from web version for TypeScript compatibility
// At runtime, Metro will pick the correct platform-specific file
export { default, SearchMarker, StationMarker } from "./StationMarker.web";
