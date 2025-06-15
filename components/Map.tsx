import { images } from "@/assets/constants";
import driverInfo from "@/data/driverinfo";
import { useLocationStore } from "@/store";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native"; // Import Button for testing
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";

// Helper function to calculate distance between two points (in meters)
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
}

export default function Map() {
  const {
    userLatitude,
    userLongitude,
    userAddress,
    destinationLatitude,
    destinationLongitude,
    destinationAddress,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();

  const [driverLatitude, setDriverLatitude] = useState<number | null>(null);
  const [driverLongitude, setDriverLongitude] = useState<number | null>(null);
  const [driverAddress, setDriverAddress] = useState<string>("Driver Location");

  // New state variable to control driver movement
  const [startDriverMovement, setStartDriverMovement] =
    useState<boolean>(false);

  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const simulationIntervalRef: any = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Get User Location & Set Initial Driver Location ---
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        console.log("Current User Location:", location.coords);

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: "Your Location",
        });

        // Set driver's starting location a bit away from the user
        setDriverLatitude(driverInfo.location.latitude + 0.02); // North by ~2.2km
        setDriverLongitude(driverInfo.location.longitude + 0.02); // East by ~2.2km
        setDriverAddress("Driver Initial Location");

        // Set a dummy destination for demonstration if none exists
        // if (destinationLatitude === null || destinationLongitude === null) {
        //   setDestinationLocation({
        //     latitude: location.coords.latitude + 0.01,
        //     longitude: location.coords.longitude - 0.01,
        //     address: "Dummy Destination",
        //   });
        // }
      } catch (error) {
        console.error("Error getting current position:", error);
      }
    };

    getLocation();

    // Cleanup: Stop any running simulation if the component unmounts
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [
    setUserLocation,
    setDestinationLocation,
    destinationLatitude,
    destinationLongitude,
  ]);

  // --- 2. Simulate Driver Movement Towards User (Controlled by startDriverMovement) ---
  useEffect(() => {
    // Crucially: Only run simulation if startDriverMovement is true
    if (!startDriverMovement) {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current); // Stop if it was running
      }
      return; // Do not proceed if not supposed to move
    }

    // Only run simulation if user and driver locations are known
    if (
      userLatitude === null ||
      userLongitude === null ||
      driverLatitude === null ||
      driverLongitude === null
    ) {
      return; // Cannot start simulation without all data
    }

    // Clear any previous simulation interval to prevent multiple running
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    const intervalTime = 1000; // Update every 1 second
    const metersPerStep = 50; // Move 50 meters per update
    const arrivalDistance = 100; // Stop when driver is within 100 meters

    console.log("Starting driver movement simulation...");

    // Start the simulation interval
    simulationIntervalRef.current = setInterval(() => {
      // Get the *current* driver location from the state
      const currentLat = driverLatitude;
      const currentLon = driverLongitude;

      if (currentLat === null || currentLon === null) {
        // This case should ideally be covered by the initial checks,
        // but included for robustness within the interval.
        return;
      }

      // Calculate distance to user
      const distanceToUser = haversineDistance(
        currentLat,
        currentLon,
        userLatitude,
        userLongitude
      );

      // If driver is close enough OR if movement should stop, stop the simulation
      if (distanceToUser < arrivalDistance) {
        console.log("Driver has arrived at user location!");
        if (simulationIntervalRef.current) {
          clearInterval(simulationIntervalRef.current);
        }
        setDriverAddress("Driver Arrived!");
        setStartDriverMovement(false); // Set movement state to false on arrival
        return; // Stop processing this step
      }

      // Calculate direction (bearing) from driver to user
      const φ1 = (currentLat * Math.PI) / 180; // Driver Lat in radians
      const φ2 = (userLatitude * Math.PI) / 180; // User Lat in radians
      const Δλ = ((userLongitude - currentLon) * Math.PI) / 180; // Longitude difference

      const y = Math.sin(Δλ) * Math.cos(φ2);
      const x =
        Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
      const bearing = Math.atan2(y, x); // Bearing in radians

      // Calculate new driver position
      const R = 6371e3; // Earth's radius in meters
      const angularDistance = metersPerStep / R; // Angular distance to move

      const newLatRad = Math.asin(
        Math.sin(φ1) * Math.cos(angularDistance) +
          Math.cos(φ1) * Math.sin(angularDistance) * Math.cos(bearing)
      );
      const newLonRad =
        (currentLon * Math.PI) / 180 + // Driver Lon in radians
        Math.atan2(
          Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(φ1),
          Math.cos(angularDistance) - Math.sin(φ1) * Math.sin(newLatRad)
        );

      const nextDriverLat = newLatRad * (180 / Math.PI); // Convert back to degrees
      const nextDriverLon = newLonRad * (180 / Math.PI);

      // Update the driver's location state
      setDriverLatitude(nextDriverLat);
      setDriverLongitude(nextDriverLon);

      console.log(
        `Driver moving. Distance remaining: ${distanceToUser.toFixed(2)}m`
      );
    }, intervalTime);

    // Cleanup: Clear the interval when the component unmounts or these dependencies change
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        console.log("Driver movement simulation stopped.");
      }
    };
  }, [
    startDriverMovement, // NEW: This effect now depends on startDriverMovement
    userLatitude,
    userLongitude,
    driverLatitude,
    driverLongitude,
    setDriverLatitude, // Add setters if using them in the cleanup or other parts for clarity
    setDriverLongitude,
    setDriverAddress, // Added as it's used in the effect
  ]);

  // --- 3. Route Calculation (between user and destination) ---
  const routeCoordinates = useMemo(() => {
    const coords: LatLng[] = [];
    if (userLatitude && userLongitude) {
      coords.push({ latitude: userLatitude, longitude: userLongitude });
    }
    if (destinationLatitude && destinationLongitude) {
      coords.push({
        latitude: destinationLatitude,
        longitude: destinationLongitude,
      });
    }
    return coords;
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  // --- 4. Fit Map to all markers ---
  useEffect(() => {
    if (!mapReady || !mapRef.current) {
      return;
    }

    const coordinatesToFit: LatLng[] = [];

    if (userLatitude && userLongitude) {
      coordinatesToFit.push({
        latitude: userLatitude,
        longitude: userLongitude,
      });
    }
    if (destinationLatitude && destinationLongitude) {
      coordinatesToFit.push({
        latitude: destinationLatitude,
        longitude: destinationLongitude,
      });
    }
    if (driverLatitude && driverLongitude) {
      coordinatesToFit.push({
        latitude: driverLatitude,
        longitude: driverLongitude,
      });
    }

    if (coordinatesToFit.length > 0) {
      if (coordinatesToFit.length === 1) {
        mapRef.current.animateToRegion(
          {
            latitude: coordinatesToFit[0].latitude,
            longitude: coordinatesToFit[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      } else {
        mapRef.current.fitToCoordinates(coordinatesToFit, {
          edgePadding: { top: 100, right: 50, bottom: 150, left: 50 },
          animated: true,
        });
      }
    }
  }, [
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    driverLatitude,
    driverLongitude,
    mapReady,
  ]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: userLatitude || 37.78825,
          longitude: userLongitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onMapReady={() => {
          setMapReady(true);
        }}
      >
        {/* User's Location Marker */}
        {userLatitude && userLongitude && (
          <Marker
            coordinate={{ latitude: userLatitude, longitude: userLongitude }}
            title="My Location"
            description={userAddress || "Your Location"}
            pinColor="blue"
          />
        )}

        {/* Destination Marker */}
        {destinationLatitude && destinationLongitude && (
          <Marker
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            description={destinationAddress || "Your Destination"}
            pinColor="red"
          />
        )}

        {/* Driver Marker with custom icon */}
        {driverLatitude && driverLongitude && (
          <Marker
            coordinate={{
              latitude: driverLatitude,
              longitude: driverLongitude,
            }}
            title="Driver"
            description={driverAddress || "Your Driver"}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Image source={images.carIcon} style={styles.driverIcon} />
          </Marker>
        )}

        {/* Polyline between User and Destination */}
        {routeCoordinates.length === 2 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#1E90FF"
            strokeWidth={4}
            lineDashPattern={[0]}
            geodesic={true}
            zIndex={1}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  driverIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    zIndex: 10, // Ensure buttons are above the map
  },
});
//  {/* Control buttons for testing */}
//       <View style={styles.buttonContainer}>
//         <Button
//           title={startDriverMovement ? "Stop Driver" : "Start Driver"}
//           onPress={() => setStartDriverMovement(!startDriverMovement)}
//           color={startDriverMovement ? "red" : "green"}
//         />
//         {/* You might want a "Reset Driver Position" button too for testing */}
//         <Button
//           title="Reset Driver"
//           onPress={() => {
//             if (userLatitude !== null && userLongitude !== null) {
//               setStartDriverMovement(false); // Stop movement
//               setDriverLatitude(userLatitude + 0.02); // Reset to initial offset
//               setDriverLongitude(userLongitude + 0.02);
//               setDriverAddress("Driver Initial Location");
//             }
//           }}
//           color="gray"
//         />
//       </View>
