import vehicleTypes from "@/data/vechilestypes";
import { useDriverStore } from "@/store";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

function VehicleTypeModal({ openModal, back }: any) {
  const { setVehiclePicked } = useDriverStore();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  return (
    <View style={styles.vehicleModalContainer}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Pressable onPress={() => back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.title}>Choose a Vehicle</Text>
        <View style={styles.headerSpacer} /> {/* For spacing */}
      </View>

      <FlatList
        data={vehicleTypes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.vehicleCard,
              selectedVehicle === item.id && styles.vehicleCardSelected,
            ]}
            onPress={() => setSelectedVehicle(item.id)}
          >
            <Image source={item.icon} style={styles.vehicleIcon} />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{item.name}</Text>
              <Text style={styles.vehicleDescription}>{item.description}</Text>
              <Text style={styles.vehicleArrival}>
                Arrives in {item.estimatedArrival}
              </Text>
            </View>
            <View style={styles.vehiclePrice}>
              <Text style={styles.vehiclePriceText}>
                ₵{(item.baseFare * 12).toFixed(2)}
              </Text>
              <Text style={styles.vehiclePriceNote}>Base fare</Text>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.vehicleDivider} />}
      />

      <Pressable
        style={[
          styles.confirmButton,
          !selectedVehicle && styles.confirmButtonDisabled,
        ]}
        onPress={() => {
          if (selectedVehicle) {
            console.log("Selected vehicle:", selectedVehicle);
            setVehiclePicked(selectedVehicle);
            openModal();
          }
        }}
        disabled={!selectedVehicle}
      >
        <Text style={styles.confirmButtonText}>Confirm {selectedVehicle}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  vehicleModalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: height * 0.85,
    flex: 1,
  },

  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40, // Same as back button for balance
  },

  // List content
  listContent: {
    paddingBottom: 20,
  },

  // Vehicle card styles
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FFF",
  },
  vehicleCardSelected: {
    backgroundColor: "#F5F5F7",
    borderColor: "#000",
    borderWidth: 1,
  },
  vehicleIcon: {
    width: 56,
    height: 40,
    marginRight: 16,
    resizeMode: "contain",
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  vehicleDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  vehicleArrival: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },
  vehiclePrice: {
    alignItems: "flex-end",
    minWidth: 80,
  },
  vehiclePriceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  vehiclePriceNote: {
    fontSize: 12,
    color: "#6B7280",
  },
  vehicleDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },

  // Confirm button
  confirmButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default VehicleTypeModal;
