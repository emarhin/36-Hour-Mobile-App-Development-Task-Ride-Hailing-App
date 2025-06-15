import places from "@/data/places";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AutocompleteProps {
  setlocation: (location: any) => void;
  placeholder?: string;
  isLoading?: boolean;
  onClear?: () => void;
}

export default function Autocomplete({
  setlocation,
  placeholder = "Search locations...",
  isLoading = false,
  onClear,
}: AutocompleteProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return places.filter((item) => item.name.toLowerCase().includes(lower));
  }, [query, places]);

  const handleSelect = useCallback(
    (item: any) => {
      setlocation({
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
      });

      setQuery(item.name);
      setShowSuggestions(false);
      Keyboard.dismiss();
    },
    [setlocation]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
    onClear?.();
  }, [onClear]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#8A8A8F"
          value={query}
          onChangeText={setQuery}
          onFocus={() => setShowSuggestions(true)}
          clearButtonMode="never"
          returnKeyType="search"
        />

        {query && !isLoading && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}

        {isLoading && (
          <ActivityIndicator
            style={styles.loader}
            size="small"
            color="#8A8A8F"
          />
        )}
      </View>

      {showSuggestions && filtered.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filtered}
            keyExtractor={(item: any) => `${item.name}-${item.lat}-${item.lng}`}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 24,
    fontSize: 16,
    color: "#1C1C1E",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 8,
  },
  clearIcon: {
    fontSize: 18,
    color: "#8A8A8F",
    fontWeight: "300",
  },
  loader: {
    marginLeft: 8,
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  itemText: {
    fontSize: 16,
    color: "#1C1C1E",
  },
});
