import { Borrowed, useCDContext } from "@/components/cd-context";
import CDCard from "@/components/CDCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReturnScreen() {
  const { borrowed, returnCD, cds } = useCDContext();
  const [selectedBorrowed, setSelectedBorrowed] = useState<Borrowed | null>(
    null,
  );

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

  const renderBorrowed = ({ item, index }: { item: any; index: number }) => {
    const now = new Date();
    const isOverdue = now > item.dueDate;
    const isSelected = selectedBorrowed?.id === item.id;

    return (
      <CDCard
        item={item}
        type="borrowed"
        index={index}
        onPress={() => setSelectedBorrowed(item)}
        selected={isSelected}
        isOverdue={isOverdue}
      />
    );
  };

  const borrowedWithTitles = borrowed.map((b: any) => {
    const cd = cds.find((c: any) => c.id === b.cdId);
    return { ...b, title: cd?.title || "Unknown" };
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText lightColor="white" darkColor="white" style={styles.header}>
        Borrowed CDs
      </ThemedText>
      <FlatList
        data={borrowedWithTitles}
        keyExtractor={(item) => item.id}
        renderItem={renderBorrowed}
        style={styles.list}
        initialNumToRender={10}
      />
      {selectedBorrowed && (
        <View style={styles.returnForm}>
          <ThemedText lightColor="#1e3a8a" darkColor="#1e3a8a">
            Selected: {selectedBorrowed.title}
          </ThemedText>
          <TouchableOpacity style={styles.button} onPress={handleReturn}>
            <ThemedText
              lightColor="#1e3a8a"
              darkColor="#1e3a8a"
              style={styles.buttonText}
            >
              Return CD
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  borrowedItem: {
    padding: 20,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selected: {
    backgroundColor: "#d4edda",
    borderWidth: 2,
    borderColor: "#28a745",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  overdue: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  returnForm: {
    padding: 20,
    backgroundColor: "#d4edda",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#dc3545",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
