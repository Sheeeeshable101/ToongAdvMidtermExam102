import { Platform } from "react-native";

const tintColorLight = "#60a5fa";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#001F3F",
    tint: tintColorLight,
    icon: "#1e40af",
    tabIconDefault: "#94a3b8",
    tabIconSelected: tintColorLight,
    card: "rgba(232, 244, 253, 0.8)",
    primary: "#1e3a8a",
    secondary: "#1e40af",
    overdue: "#ef4444",
    headerText: "#ffffff",
    cardText: "#1e3a8a",
  },
  dark: {
    text: "#f8fafc",
    background: "#001F3F",
    tint: tintColorDark,
    icon: "#94a3b8",
    tabIconDefault: "#94a3b8",
    tabIconSelected: tintColorDark,
    card: "rgba(15, 23, 42, 0.8)",
    primary: "#60a5fa",
    secondary: "#93c5fd",
    overdue: "#f87171",
    headerText: "#ffffff",
    cardText: "#93c5fd",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
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
