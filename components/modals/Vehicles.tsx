import { images } from "@/assets/constants";
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
import Modal from "react-native-modal";

const { height } = Dimensions.get("window");

function VehicleTypeModal({ visible, onClose }: any) {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const vehicleTypes = [
    {
      id: "economy",
      name: "QuickRide Economy",
      description: "Affordable rides for everyday trips",
      baseFare: 2.5,
      perKmRate: 1.2,
      perMinuteRate: 0.25,
      capacity: 4,
      estimatedArrival: "3-5 min",
      icon: images.carIcon, // Replace with your actual icon paths
    },
    {
      id: "premium",
      name: "QuickRide Premium",
      description: "Comfortable rides with professional drivers",
      baseFare: 4.0,
      perKmRate: 2.0,
      perMinuteRate: 0.4,
      capacity: 4,
      estimatedArrival: "2-4 min",
      icon: images.carIcon,
    },
  ];

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      style={styles.vehicleModal}
    >
      <View style={styles.vehicleModalContainer}>
        <View style={styles.vehicleHeader}>
          <Text style={styles.vehicleTitle}>Choose a ride</Text>
          <Pressable onPress={onClose} style={styles.vehicleCloseButton}>
            <MaterialIcons name="close" size={24} color="#000" />
          </Pressable>
        </View>

        <FlatList
          data={vehicleTypes}
          keyExtractor={(item) => item.id}
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
                <Text style={styles.vehicleDescription}>
                  {item.description}
                </Text>
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
              onClose();
            }
          }}
          disabled={!selectedVehicle}
        >
          <Text style={styles.confirmButtonText}>
            Confirm {selectedVehicle}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  kavContainer: {
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: height * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
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
    backgroundColor: "#00CC66",
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
    backgroundColor: "#FF0000",
    marginRight: 12,
  },
  autocompleteContainer: {
    flex: 1,
  },
  autocomplete: {
    marginBottom: 0,
    borderWidth: 0,
    paddingHorizontal: 0,
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

  // Vehicle Modal Styles
  vehicleModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  vehicleModalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: height * 0.85,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  vehicleCloseButton: {
    padding: 8,
  },
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
  confirmButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 24,
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
