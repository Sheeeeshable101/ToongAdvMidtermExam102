import { CD, useCDContext } from "@/components/cd-context";
import CDCard from "@/components/CDCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BorrowScreen() {
  const { cds, borrowCD } = useCDContext();
  const [selectedCD, setSelectedCD] = useState<CD | null>(null);
  const [borrowerName, setBorrowerName] = useState("");

  const handleSelectCD = (item: CD) => {
    if (item.availableCopies === 0) {
      Alert.alert("Not Available", "CD not available.");
      return;
    }
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

  const renderCD = ({ item, index }: { item: CD; index: number }) => {
    const isSelected = selectedCD?.id === item.id;
    const isUnavailable = item.availableCopies === 0;

    return (
      <CDCard
        item={item}
        type="available"
        index={index}
        onPress={() => handleSelectCD(item)}
        selected={isSelected}
        isOverdue={isUnavailable}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText lightColor="white" darkColor="white" style={styles.header}>
        All CDs
      </ThemedText>
      <FlatList
        data={cds}
        keyExtractor={(item) => item.id}
        renderItem={renderCD}
        style={styles.list}
        initialNumToRender={10}
      />
      {selectedCD && (
        <View style={styles.borrowForm}>
          <ThemedText lightColor="#1e3a8a" darkColor="#1e3a8a">
            Selected: {selectedCD.title}
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Borrower Name"
            value={borrowerName}
            onChangeText={setBorrowerName}
          />
          <TouchableOpacity style={styles.button} onPress={handleBorrow}>
            <ThemedText
              lightColor="#1e3a8a"
              darkColor="#1e3a8a"
              style={styles.buttonText}
            >
              Borrow CD
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
  cdItem: {
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
  unavailable: {
    backgroundColor: "#f8d7da",
    opacity: 0.7,
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
  artist: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 4,
  },
  copies: {
    fontSize: 16,
    fontWeight: "600",
  },
  borrowForm: {
    padding: 20,
    backgroundColor: "#e9ecef",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#28a745",
    padding: 12,
    marginVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#28a745",
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
