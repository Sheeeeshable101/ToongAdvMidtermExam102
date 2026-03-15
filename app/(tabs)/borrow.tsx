import { CD, useCDContext } from "@/components/cd-context";
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
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function BorrowScreen() {
  const { cds, borrowCD, isLoading } = useCDContext();
  const colorScheme = useColorScheme();
  const [selectedCD, setSelectedCD] = useState<CD | null>(null);
  const [borrowerName, setBorrowerName] = useState("");

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

  const availableCDs = cds.filter((cd) => cd.availableCopies > 0);

  const handleSelectCD = (item: CD) => {
    setSelectedCD(item);
  };

  const handleBorrow = async () => {
    if (!selectedCD || !borrowerName.trim()) {
      Alert.alert("Error", "Please select a CD and enter borrower name.");
      return;
    }
    try {
      await borrowCD(selectedCD.id, borrowerName.trim());
      Alert.alert("Success", "CD borrowed successfully!");
      setSelectedCD(null);
      setBorrowerName("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const renderCD = ({ item }: { item: CD }) => (
    <Animated.View
      entering={FadeIn.duration(500)}
      style={[styles.cdCard, selectedCD?.id === item.id && styles.selectedCard]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => handleSelectCD(item)}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>{item.artist}</ThemedText>
        <ThemedText style={styles.cardCopies}>
          Available: {item.availableCopies}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>
        Available CDs ({availableCDs.length})
      </ThemedText>
      <FlatList
        data={availableCDs}
        keyExtractor={(item) => item.id}
        renderItem={renderCD}
        style={styles.list}
        ListEmptyComponent={
          <Animated.View
            entering={FadeIn.duration(500)}
            style={styles.emptyContainer}
          >
            <ThemedText style={styles.emptyText}>No available CDs</ThemedText>
          </Animated.View>
        }
      />
      {selectedCD && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.borrowContainer}
        >
          <ThemedView style={styles.selectedContainer}>
            <ThemedText style={styles.selectedTitle}>Selected CD</ThemedText>
            <ThemedText style={styles.selectedSubtitle}>
              {selectedCD.title}
            </ThemedText>
            <ThemedText
              lightColor="white"
              darkColor="white"
              style={styles.cardSubtitle}
            >
              {selectedCD.artist}
            </ThemedText>
          </ThemedView>
          <TextInput
            style={styles.input}
            placeholder="Borrower Name"
            value={borrowerName}
            onChangeText={setBorrowerName}
          />
          <TouchableOpacity
            style={styles.borrowButton}
            onPress={handleBorrow}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>Borrow CD</ThemedText>
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
  cdCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#c6bbbb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "rgba(30, 58, 138, 0.15)",
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#60a5fa",
    backgroundColor: "rgba(96, 165, 250, 0.25)",
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
  cardCopies: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.9,
  },
  borrowContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#112840",
  },
  selectedContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "rgba(96, 165, 250, 0.2)",
    shadowColor: "#b7a9a9",
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "rgba(27, 41, 108, 0.9)",
  },
  borrowButton: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#d7d4d4",
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
