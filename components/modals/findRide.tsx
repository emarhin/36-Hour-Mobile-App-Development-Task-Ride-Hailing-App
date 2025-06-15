import Autocomplete from "@/components/autocomplete";
import { useLocationStore } from "@/store";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

function BookingModal({ openModal }: any) {
  const [isBooking, setIsBooking] = useState(false);

  const {
    userAddress,
    setUserLocation,
    setDestinationLocation,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const canBook =
    !!userAddress && !!destinationLatitude && !!destinationLongitude;

  const handleBook = useCallback(() => {
    if (!canBook) return;

    setIsBooking(true);

    // Simulate booking logic
    setTimeout(() => {
      setIsBooking(false);
      openModal();
    }, 500);
  }, [canBook]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.kavContainer}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#6B7280" />
          </Pressable>
        </View>

        <Text style={styles.title}>Where to?</Text>

        <View style={styles.inputGroup}>
          <View style={styles.inputRow}>
            <View style={styles.pickupDot}>
              <View style={styles.innerDot} />
            </View>
            <View style={styles.autocompleteContainer}>
              <Autocomplete
                placeholder={
                  userAddress === "Your Location"
                    ? `{${userAddress}}`
                    : userAddress
                      ? userAddress
                      : "Enter pickup"
                }
                setlocation={(location) => {
                  setUserLocation(location); // Must match store shape
                }}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.destinationDot} />
            <View style={styles.autocompleteContainer}>
              <Autocomplete
                placeholder="Enter destination"
                setlocation={(location) => {
                  setDestinationLocation(location); // Must match store shape
                }}
              />
            </View>
          </View>
        </View>

        <Pressable
          style={[
            styles.bookButton,
            (!canBook || isBooking) && styles.bookButtonDisabled,
          ]}
          onPress={handleBook}
          disabled={!canBook || isBooking}
          accessibilityRole="button"
        >
          {isBooking ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.bookButtonText}>
              {canBook ? "Confirm Ride" : "Set destination"}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

export default BookingModal;

const styles = StyleSheet.create({
  kavContainer: {
    justifyContent: "flex-end",
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: -8,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 24,
    textAlign: "left",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  inputGroup: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pickupDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "black",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },
  destinationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "black",
    marginRight: 12,
  },
  autocompleteContainer: {
    flex: 1,
  },
  bookButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  bookButtonDisabled: {
    backgroundColor: "#868686",
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
