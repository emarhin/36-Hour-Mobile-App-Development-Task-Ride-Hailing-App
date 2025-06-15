import driverInfo from "@/data/driverinfo";
import { useDriverStore, useLocationStore } from "@/store";
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

type BookingStatus =
  | "Searching"
  | "DriverAssigned"
  | "EnRoute"
  | "Arrived"
  | "InProgress"
  | "Completed";

const DriverConfirmationScreen = ({ openModal }) => {
  const { setDriverComing, distanceRemaingToReachUser } = useDriverStore();

  // Simulation state
  const [distance, setDistance] = useState(1.5);
  const [eta, setEta] = useState(5);
  const [driverPosition, setDriverPosition] = useState(0.1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const { reset } = useLocationStore();

  // Booking status state
  const [bookingStatus, setBookingStatus] =
    useState<BookingStatus>("Searching");

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Simulate booking flow
  useEffect(() => {
    if (!isSimulating) return;

    // Initial searching state
    const searchTimer = setTimeout(() => {
      setBookingStatus("DriverAssigned");

      // Driver preparation time
      const preparationTimer = setTimeout(() => {
        setBookingStatus("EnRoute");
      }, 3000);

      return () => clearTimeout(preparationTimer);
    }, 2000);

    return () => clearTimeout(searchTimer);
  }, [isSimulating]);

  // Simulate driver movement during EnRoute state
  useEffect(() => {
    if (bookingStatus !== "EnRoute" || !isSimulating) return;

    const movementInterval = setInterval(() => {
      setDistance((prevDistance) => {
        const newDistance = Math.max(0, prevDistance - 0.1);
        setEta((prevEta) => Math.max(0, prevEta - 0.3));
        setDriverPosition(1 - newDistance / 1.5);

        if (newDistance <= 0.1) {
          clearInterval(movementInterval);
          setBookingStatus("Arrived");

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: distanceRemaingToReachUser,
            useNativeDriver: true,
          }).start();
        }

        return newDistance;
      });
    }, 1000);

    return () => clearInterval(movementInterval);
  }, [bookingStatus, isSimulating]);

  // Animate progress bar
  useEffect(() => {
    if (bookingStatus !== "EnRoute" && bookingStatus !== "Arrived") return;
    setDriverComing(true);

    Animated.timing(progressAnim, {
      toValue: driverPosition,
      duration: distanceRemaingToReachUser,
      useNativeDriver: false,
    }).start();
  }, [driverPosition, bookingStatus]);

  // Format time display
  const formatTime = (minutes: number) => {
    if (minutes < 1) return "< 1 min";
    return `${Math.ceil(minutes)} min`;
  };

  // Handle trip cancellation
  const handleCancelTrip = () => {
    setBookingStatus("Completed");
    setIsSimulating(false);
    setShowCancelModal(false);
    Animated.timing(progressAnim).stop();
    fadeAnim.setValue(0);
  };

  // Handle trip actions
  const handleStartTrip = () => setBookingStatus("InProgress");
  const handleCompleteTrip = () => setBookingStatus("Completed");

  // Reset the simulation
  const resetSimulation = () => {
    reset();
    openModal();
  };

  // Render status indicator
  const renderStatusIndicator = () => {
    const statusConfig: Record<BookingStatus, { color: string; text: string }> =
      {
        Searching: { color: "#FFA500", text: "Finding a driver..." },
        DriverAssigned: { color: "#1E90FF", text: "Driver assigned" },
        EnRoute: { color: "#32CD32", text: "Driver en route" },
        Arrived: { color: "#228B22", text: "Driver arrived" },
        InProgress: { color: "#8A2BE2", text: "Trip in progress" },
        Completed: { color: "#808080", text: "Trip completed" },
      };

    const { color, text } = statusConfig[bookingStatus];

    return (
      <View style={[styles.statusContainer, { backgroundColor: color }]}>
        <Text style={styles.statusText}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Status Indicator */}
      {renderStatusIndicator()}

      {bookingStatus === "Completed" ? (
        <View style={styles.cancelledContainer}>
          <Text style={styles.cancelledTitle}>
            {bookingStatus === "Completed"
              ? "Trip Completed"
              : "Trip Cancelled"}
          </Text>
          <Text style={styles.cancelledText}>
            {bookingStatus === "Completed"
              ? "Your trip has been successfully completed."
              : "Your trip has been successfully cancelled."}
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
          <Text style={styles.title}>
            {bookingStatus === "Searching"
              ? "Finding your driver..."
              : bookingStatus === "DriverAssigned"
                ? "Driver is preparing!"
                : bookingStatus === "EnRoute"
                  ? "Driver is on the way!"
                  : bookingStatus === "Arrived"
                    ? "Driver has arrived!"
                    : "Trip in progress"}
          </Text>

          {/* Progress visualization */}
          {(bookingStatus === "EnRoute" || bookingStatus === "Arrived") && (
            <>
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
            </>
          )}

          {/* Driver information */}
          {bookingStatus !== "Searching" && (
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
                  {driverInfo?.vehicle.model} •{" "}
                  {driverInfo?.vehicle.licensePlate}
                </Text>
              </View>
            </View>
          )}

          {/* Status information */}
          {(bookingStatus === "EnRoute" || bookingStatus === "Arrived") && (
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
          )}

          {/* Action buttons */}
          {bookingStatus === "Arrived" && (
            <Animated.View
              style={[styles.arrivalContainer, { opacity: fadeAnim }]}
            >
              <TouchableOpacity
                style={styles.startTripButton}
                onPress={handleStartTrip}
              >
                <Text style={styles.startTripButtonText}>Start Trip</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {bookingStatus === "InProgress" && (
            <View style={styles.inProgressContainer}>
              <Text style={styles.inProgressText}>Your trip is ongoing</Text>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleCompleteTrip}
              >
                <Text style={styles.completeButtonText}>Complete Trip</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cancel Trip Button */}
          {bookingStatus !== "Completed" && bookingStatus !== "InProgress" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCancelModal(true)}
            >
              <Text style={styles.cancelButtonText}>Cancel Trip</Text>
            </TouchableOpacity>
          )}
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
                <Text style={{ color: "black" }}>Continue Trip</Text>
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
  statusContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 15,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
  startTripButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  startTripButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  inProgressContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  inProgressText: {
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
  },
  completeButton: {
    backgroundColor: "#8A2BE2",
    padding: 15,
    borderRadius: 8,
    minWidth: "60%",
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DriverConfirmationScreen;
