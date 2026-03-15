import type { Borrowed, CD } from "@/components/cd-context";
import { Colors, Shadows } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import LinearGradient from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type BorrowedWithTitle = Borrowed & { title: string };

type Item = CD | BorrowedWithTitle;

interface CDCardProps {
  item: Item;
  type: "available" | "borrowed";
  index: number;
  onPress?: () => void;
  selected?: boolean;
  isOverdue?: boolean;
}

const CDCard: React.FC<CDCardProps> = ({
  item,
  type,
  index,
  onPress,
  selected = false,
  isOverdue = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme as "light" | "dark"];
  const shadowConfig = Shadows.card[colorScheme as "light" | "dark"];
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 + index * 50 });
  }, []);

  const isCD = "availableCopies" in item;
  const title = item.title;
  const artist = isCD ? (item as CD).artist : "";
  const availableCopies = isCD ? (item as CD).availableCopies : undefined;

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const statusBadge = selected || isOverdue;

  return (
    <Animated.View style={[styles.container, shadowConfig, animatedStyle]}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          selected && styles.selected,
          pressed && styles.pressed,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {/* CD Disc */}
        <LinearGradient
          colors={["#e5e5e5", "#f8f9fa", "#d1d5db"]}
          style={styles.cdDisc}
        >
          <View style={styles.cdCenter} />
          <Text style={styles.cdLabel}>CD</Text>
        </LinearGradient>

        {/* Info */}
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: colors.primary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {artist && (
            <Text
              style={[styles.artist, { color: colors.icon }]}
              numberOfLines={1}
            >
              {artist}
            </Text>
          )}
          {availableCopies !== undefined && (
            <Text
              style={[
                styles.statusText,
                {
                  color: availableCopies === 0 ? colors.danger : colors.success,
                },
              ]}
            >
              {availableCopies} available
            </Text>
          )}
          {type === "borrowed" && (
            <>
              <Text style={[styles.detail, { color: colors.icon }]}>
                {(item as BorrowedWithTitle).borrowerName}
              </Text>
              <Text style={[styles.detail, { color: colors.icon }]}>
                Due: {(item as BorrowedWithTitle).dueDate.toLocaleDateString()}
              </Text>
            </>
          )}
        </View>

        {statusBadge && (
          <View
            style={[
              styles.badge,
              selected ? styles.badgeSuccess : styles.badgeDanger,
              { backgroundColor: selected ? colors.success : colors.danger },
            ]}
          >
            <Text style={styles.badgeText}>
              {selected ? "Selected" : "Overdue"}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  card: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#ffffff", // fallback
    minHeight: 100,
  },
  selected: {
    borderWidth: 3,
    borderColor: "#10b981",
  },
  pressed: {
    opacity: 0.9,
  },
  cdDisc: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  cdCenter: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#222",
  },
  cdLabel: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  detail: {
    fontSize: 14,
    marginTop: 2,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  badgeSuccess: {},
  badgeDanger: {},
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default CDCard;
