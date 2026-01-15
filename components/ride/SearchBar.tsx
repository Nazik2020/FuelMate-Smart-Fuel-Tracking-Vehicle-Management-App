// Search Bar Component with Results Dropdown

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchResults: SearchResult[];
  showSearchResults: boolean;
  isSearching: boolean;
  onSelectResult: (result: SearchResult) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  searchResults,
  showSearchResults,
  isSearching,
  onSelectResult,
  onClear,
}) => {
  const handleSelectResult = (result: SearchResult) => {
    onSelectResult(result);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          placeholderTextColor={Colors.gray}
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          returnKeyType="search"
        />
        {isSearching && (
          <ActivityIndicator size="small" color={Colors.primary} />
        )}
        {searchQuery.length > 0 && !isSearching && (
          <TouchableOpacity onPress={onClear}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results Dropdown */}
      {showSearchResults && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.place_id.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResultItem}
                onPress={() => handleSelectResult(item)}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Colors.primary}
                />
                <View style={styles.searchResultText}>
                  <Text style={styles.searchResultTitle} numberOfLines={1}>
                    {item.display_name.split(",")[0]}
                  </Text>
                  <Text style={styles.searchResultSubtitle} numberOfLines={1}>
                    {item.display_name.split(",").slice(1, 3).join(",")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 70,
    right: 16,
    zIndex: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text,
  },
  searchResultsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    gap: 10,
  },
  searchResultText: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  searchResultSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default SearchBar;
