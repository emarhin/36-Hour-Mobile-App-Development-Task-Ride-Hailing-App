import { images } from "@/assets/constants";
import driverInfo from "@/data/driverinfo";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DriverConfirmationScreen = ({ openModal }) => {
  // Simulation state
  const [distance, setDistance] = useState(1.5); // in km
  const [eta, setEta] = useState(5); // in minutes
  const [driverPosition, setDriverPosition] = useState(0.1); // 0-1 position
  const [isArrived, setIsArrived] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Simulate driver movement
  useEffect(() => {
    if (!isSimulating || isArrived || isCancelled) return;

    const interval = setInterval(() => {
      // Update distance and ETA
      const newDistance = Math.max(0, distance - 0.1);
      const newEta = Math.max(0, eta - 0.3);

      setDistance(newDistance);
      setEta(newEta);
      setDriverPosition(1 - newDistance / 1.5);

      // Check if driver arrived
      if (newDistance <= 0.1 && !isArrived) {
        setIsArrived(true);
        clearInterval(interval);

        // Trigger arrival animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [distance, eta, isArrived, isSimulating, isCancelled]);

  // Animate progress bar
  useEffect(() => {
    if (isCancelled) return;

    Animated.timing(progressAnim, {
      toValue: driverPosition,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [driverPosition]);

  // Format time display
  const formatTime = (minutes: number) => {
    if (minutes < 1) return "< 1 min";
    return `${Math.ceil(minutes)} min`;
  };

  // Handle trip cancellation
  const handleCancelTrip = () => {
    console.log("Trip cancelled");
    setIsCancelled(true);
    setIsSimulating(false);
    setShowCancelModal(false);

    // Reset animation values
    Animated.timing(progressAnim).stop();
    fadeAnim.setValue(0);
  };

  // Reset the simulation
  const resetSimulation = () => {
    setDistance(1.5);
    setEta(5);
    setDriverPosition(0.1);
    setIsArrived(false);
    setIsCancelled(false);
    setIsSimulating(true);
    progressAnim.setValue(0);
  };

  return (
    <View style={styles.container}>
      {isCancelled ? (
        <View style={styles.cancelledContainer}>
          <Text style={styles.cancelledTitle}>Trip Cancelled</Text>
          <Text style={styles.cancelledText}>
            Your trip has been successfully cancelled.
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetSimulation}
          >
            <Text style={styles.resetButtonText}>Start New Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Driver is on the way!</Text>

          {/* Progress visualization */}
          <View style={styles.routeContainer}>
            <View style={styles.locationDot} />
            <View style={styles.routeLine}>
              <Animated.View
                style={[
                  styles.driverPosition,
                  { left: `${driverPosition * 100}%` },
                ]}
              >
                <Image source={images.carIcon} style={styles.carIcon} />
              </Animated.View>
            </View>
            <View style={[styles.locationDot, styles.destinationDot]} />
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Driver position</Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>

          {/* Driver information */}
          <View style={styles.driverCard}>
            <Image
              source={{ uri: driverInfo?.profileImage }}
              style={styles.driverImage}
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driverInfo?.name}</Text>
              <Text style={styles.driverRating}>
                ★ {driverInfo?.rating} ({driverInfo?.totalTrips} trips)
              </Text>
              <Text style={styles.vehicleText}>
                {driverInfo?.vehicle.color} {driverInfo?.vehicle.make}{" "}
                {driverInfo?.vehicle.model} • {driverInfo?.vehicle.licensePlate}
              </Text>
            </View>
          </View>

          {/* Status information */}
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{distance?.toFixed(1)} km</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>ETA</Text>
              <Text style={styles.infoValue}>{formatTime(eta)}</Text>
            </View>
          </View>

          {/* Arrival notification */}
          {isArrived && (
            <Animated.View
              style={[styles.arrivalContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.arrivalText}>Driver has arrived!</Text>
            </Animated.View>
          )}

          <Text style={styles.note}>
            Look for a {driverInfo?.vehicle.color} car with license plate{" "}
            {driverInfo?.vehicle.licensePlate}
          </Text>

          {/* Cancel Trip Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowCancelModal(true)}
          >
            <Text style={styles.cancelButtonText}>Cancel Trip</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cancel Trip?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to cancel this trip? A cancellation fee may
              apply.
            </Text>

            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButtonModal]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text
                  style={
                    (styles.modalButtonText,
                    {
                      color: "black",
                    })
                  }
                >
                  Continue Trip
                </Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.confirmCancelButton]}
                onPress={handleCancelTrip}
              >
                <Text style={styles.modalButtonText}>Yes, Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
    height: 60,
  },
  locationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "black",
  },
  destinationDot: {
    backgroundColor: "black",
  },
  routeLine: {
    flex: 1,
    height: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 10,
    borderRadius: 2,
    position: "relative",
  },
  driverPosition: {
    position: "absolute",
    top: -18,
    transform: [{ translateX: -15 }],
  },
  carIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "black",
  },
  driverCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    alignItems: "center",
  },
  driverImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  driverRating: {
    fontSize: 16,
    color: "blue",
    marginBottom: 6,
  },
  vehicleText: {
    fontSize: 15,
    color: "#555",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  infoBox: {
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f8ff",
    minWidth: "40%",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  arrivalContainer: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  arrivalText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  note: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  cancelButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButtonModal: {
    backgroundColor: "#f0f0f0",
  },
  confirmCancelButton: {
    backgroundColor: "black",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  // Cancelled state styles
  cancelledContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cancelledTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  cancelledText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 26,
  },
  resetButton: {
    backgroundColor: "black",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DriverConfirmationScreen;
