/**
 * FuelMate App Theme Colors
 */

import { Platform } from "react-native";

// FuelMate Brand Colors
export const Colors = {
  // Primary colors
  primary: "#0D7377", // Teal - main brand color
  primaryDark: "#0a5c5f", // Darker teal
  primaryLight: "#14919B", // Lighter teal

  // Secondary colors
  secondary: "#F5A623", // Orange - CTAs, accents
  secondaryLight: "#FFB84D",

  // Neutral colors
  white: "#FFFFFF",
  black: "#000000",
  gray: "#9CA3AF",
  grayLight: "#F3F4F6",
  grayDark: "#4B5563",

  // Background colors
  background: "#FFFFFF",
  backgroundSecondary: "#F8FAFC",

  // Text colors
  text: "#1F2937",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // For backward compatibility
  light: {
    text: "#1F2937",
    background: "#FFFFFF",
    tint: "#0D7377",
    icon: "#9CA3AF",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#0D7377",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#14919B",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#14919B",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
