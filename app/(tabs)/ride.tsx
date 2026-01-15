// Ride route - Metro bundler picks the correct platform-specific component:
// - RideScreen.native.tsx on iOS/Android
// - RideScreen.web.tsx on web
// This keeps react-native-maps out of the web bundle.

import RideScreen from "@/components/ride/RideScreen";

export default RideScreen;
