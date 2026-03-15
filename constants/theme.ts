/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#1e293b", // gray-800
    background: "#f8fafc", // slate-50
    tint: "#4f46e5", // indigo-600
    icon: "#64748b", // slate-500
    tabIconDefault: "#94a3b8", // slate-400
    tabIconSelected: "#4f46e5", // indigo-600
    primary: "#4f46e5", // indigo-600
    accent: "#a855f7", // violet-500
    cardBg: "#e0e7ff", // indigo-100
    cardGradientFrom: "#c7d2fe", // indigo-200
    cardGradientTo: "#e879f9", // pink-400
    gold: "#d97706", // amber-600
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    danger: "#ef4444", // red-500
  },
  dark: {
    text: "#f1f5f9", // slate-100
    background: "#0f172a", // slate-900
    tint: "#8b5cf6", // violet-400
    icon: "#94a3b8", // slate-400
    tabIconDefault: "#64748b", // slate-500
    tabIconSelected: "#8b5cf6", // violet-400
    primary: "#6366f1", // indigo-500
    accent: "#c084fc", // violet-300
    cardBg: "#312e81", // indigo-950
    cardGradientFrom: "#3730a3", // indigo-800
    cardGradientTo: "#be93fd", // violet-400
    gold: "#fbbf24", // amber-400
    success: "#34d399", // emerald-400
    warning: "#fbbf24", // amber-400
    danger: "#f87171", // red-400
  },
};

export const Shadows = {
  card: {
    light: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    dark: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
    },
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
