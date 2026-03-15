import { Borrowed, useCDContext } from "@/components/cd-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

export default function ReturnScreen() {
  const { borrowed, returnCD, cds, isLoading } = useCDContext();
  const colorScheme = useColorScheme();
  const [selectedBorrowed, setSelectedBorrowed] = useState<Borrowed | null>(
    null,
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
        <ThemedText style={styles.loadingText}>
          Loading Borrowed Records...
        </ThemedText>
      </ThemedView>
    );
  }

  const borrowedWithTitles = borrowed.map((b) => {
    const cd = cds.find((c) => c.id === b.cdId);
    return { ...b, title: cd?.title || "Unknown" };
  });

  const handleReturn = async () => {
    if (!selectedBorrowed) return;
    try {
      await returnCD(selectedBorrowed.id);
      Alert.alert("Success", "CD returned successfully!");
      setSelectedBorrowed(null);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const renderBorrowed = ({ item }: { item: any }) => {
    const now = new Date();
    const isOverdue = now > item.dueDate;
    const penalty = isOverdue
      ? Math.ceil(
          (now.getTime() - item.dueDate.getTime()) / (1000 * 60 * 60 * 24),
        ) * 2
      : 0;

    return (
      <Animated.View
        entering={FadeIn.duration(600)}
        layout={Layout}
        style={[
          styles.borrowedCard,
          selectedBorrowed?.id === item.id && styles.selectedCard,
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setSelectedBorrowed(item)}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.cardSubtitle}>
            Borrower: {item.borrowerName}
          </ThemedText>
          <ThemedText style={styles.cardText}>
            Due: {item.dueDate.toLocaleDateString()}
          </ThemedText>
          {isOverdue && (
            <ThemedText style={styles.overdueText}>
              Penalty: PHP {penalty}
            </ThemedText>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const selectedTitle =
    borrowedWithTitles.find((b) => b.id === selectedBorrowed?.id)?.title ||
    "Unknown";

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>
        Borrowed CDs ({borrowed.length})
      </ThemedText>
      <FlatList
        data={borrowedWithTitles}
        keyExtractor={(item) => item.id}
        renderItem={renderBorrowed}
        style={styles.list}
        ListEmptyComponent={
          <Animated.View
            entering={FadeIn.duration(500)}
            style={styles.emptyContainer}
          >
            <ThemedText style={styles.emptyText}>
              No borrowed CDs to return
            </ThemedText>
          </Animated.View>
        }
      />
      {selectedBorrowed && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.returnContainer}
        >
          <ThemedView style={styles.selectedContainer}>
            <ThemedText style={styles.selectedTitle}>
              Selected for Return
            </ThemedText>
            <ThemedText style={styles.selectedSubtitle}>
              {selectedTitle}
            </ThemedText>
            <ThemedText style={styles.cardSubtitle}>
              Borrower: {selectedBorrowed.borrowerName}
            </ThemedText>
          </ThemedView>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={handleReturn}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>Return CD</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  borrowedCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "rgba(245, 101, 101, 0.2)",
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#60a5fa",
  },
  touchable: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  cardText: {
    fontSize: 14,
    opacity: 0.9,
  },
  overdueText: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    padding: 6,
    borderRadius: 4,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
  },
  returnContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  selectedContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "rgba(96, 165, 250, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectedSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  returnButton: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: "italic",
    opacity: 0.7,
    textAlign: "center",
  },
});
