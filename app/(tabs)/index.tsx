import { useCDContext } from "@/components/cd-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

export default function HomeScreen() {
  const { cds, borrowed, totalIncome, totalBorrowed, isLoading } =
    useCDContext();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
        <ThemedText style={styles.loadingText}>
          Loading CD Library...
        </ThemedText>
      </ThemedView>
    );
  }

  const availableCDs = cds.filter((c) => c.availableCopies > 0);
  const borrowedWithTitles = borrowed.map((b) => {
    const cd = cds.find((c) => c.id === b.cdId);
    return { ...b, title: cd?.title || "Unknown" };
  });

  const renderAvailableCD = ({ item }: { item: any }) => (
    <Animated.View
      entering={FadeIn.delay(100).duration(500)}
      layout={Layout}
      style={styles.cdCard}
    >
      <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
      <ThemedText style={styles.cardSubtitle}>{item.artist}</ThemedText>
      <ThemedText style={styles.cardText}>
        Available: {item.availableCopies}
      </ThemedText>
    </Animated.View>
  );

  const renderBorrowedCD = ({ item }: { item: any }) => {
    const now = new Date();
    const isOverdue = now > item.dueDate;
    const penalty = isOverdue
      ? Math.ceil(
          (now.getTime() - item.dueDate.getTime()) / (1000 * 60 * 60 * 24),
        ) * 2
      : 0;

    return (
      <Animated.View
        entering={FadeIn.delay(200).duration(500)}
        layout={Layout}
        style={[styles.cdCard, styles.borrowedCard]}
      >
        <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>{item.borrowerName}</ThemedText>
        <ThemedText style={styles.cardText}>
          Due: {item.dueDate.toLocaleDateString()}
        </ThemedText>
        <ThemedText
          style={[
            styles.cardText,
            styles.penaltyText,
            isOverdue && styles.overdueText,
          ]}
        >
          Penalty: PHP {penalty}
        </ThemedText>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.welcomeContainer}>
        <ThemedText style={styles.welcomeTitle}>CD Library</ThemedText>
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <Animated.View entering={FadeIn.delay(300)} style={styles.statCard}>
          <ThemedText style={styles.statLabel}>Total Income</ThemedText>
          <ThemedText style={styles.statValue}>PHP {totalIncome}</ThemedText>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(400)} style={styles.statCard}>
          <ThemedText style={styles.statLabel}>Total Borrowed</ThemedText>
          <ThemedText style={styles.statValue}>{totalBorrowed}</ThemedText>
        </Animated.View>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Available CDs</ThemedText>
        <FlatList
          data={availableCDs}
          keyExtractor={(item) => item.id}
          renderItem={renderAvailableCD}
          scrollEnabled={false}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>No available CDs</ThemedText>
          }
        />
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Borrowed CDs</ThemedText>
        <FlatList
          data={borrowedWithTitles}
          keyExtractor={(item) => item.id}
          renderItem={renderBorrowedCD}
          scrollEnabled={false}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>No borrowed CDs</ThemedText>
          }
        />
      </ThemedView>
    </ScrollView>
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
  welcomeContainer: {
    padding: 24,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(96, 165, 250, 0.2)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionContainer: {
    margin: 12,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  cdCard: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(30, 58, 138, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  borrowedCard: {
    backgroundColor: "rgba(245, 101, 101, 0.15)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    opacity: 0.9,
  },
  penaltyText: {
    fontWeight: "600",
  },
  overdueText: {
    color: "#ef4444",
  },
  emptyText: {
    textAlign: "center",
    padding: 40,
    fontStyle: "italic",
    opacity: 0.7,
  },
});
