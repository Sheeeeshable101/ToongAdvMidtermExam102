import { useCDContext } from "@/components/cd-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { cds, borrowed, totalIncome, totalBorrowed } = useCDContext();

  const renderAvailableCD = ({ item, index }: { item: any; index: number }) => (
    <CDCard item={item} type="available" index={index} />
  );

  const renderBorrowedCD = ({ item, index }: { item: any; index: number }) => {
    const now = new Date();
    const isOverdue = now > item.dueDate;

    return (
      <CDCard item={item} type="borrowed" index={index} isOverdue={isOverdue} />
    );
  };

  const borrowedWithTitles = borrowed.map((b: any) => {
    const cd = cds.find((c: any) => c.id === b.cdId);
    return { ...b, title: cd?.title || "Unknown" };
  });

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText lightColor="white" darkColor="white" style={styles.header}>
          Available CDs
        </ThemedText>
        <FlatList
          data={cds}
          keyExtractor={(item) => item.id}
          renderItem={renderAvailableCD}
          scrollEnabled={false}
          initialNumToRender={10}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText lightColor="white" darkColor="white" style={styles.header}>
          Borrowed CDs
        </ThemedText>
        <FlatList
          data={borrowedWithTitles}
          keyExtractor={(item) => item.id}
          renderItem={renderBorrowedCD}
          scrollEnabled={false}
          initialNumToRender={10}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText lightColor="white" darkColor="white" style={styles.header}>
          Statistics
        </ThemedText>
        <View style={styles.statsCard}>
          <ThemedText
            lightColor="#1e3a8a"
            darkColor="#1e3a8a"
            style={styles.statsText}
          >
            Total Income: PHP {totalIncome}
          </ThemedText>
        </View>
        <View style={styles.statsCard}>
          <ThemedText
            lightColor="#1e3a8a"
            darkColor="#1e3a8a"
            style={styles.statsText}
          >
            Total Borrowed CDs: {totalBorrowed}
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cdItem: {
    padding: 20,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "#d1ecf1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  borrowedItem: {
    padding: 20,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "#fff3cd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 8,
  },
  overdue: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  statsCard: {
    padding: 20,
    backgroundColor: "#d4edda",
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  statsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#155724",
  },
});
