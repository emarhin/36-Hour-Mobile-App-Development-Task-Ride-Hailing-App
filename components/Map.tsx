/* eslint-disable react-hooks/exhaustive-deps */
import { useLocationStore } from "@/store";
import * as Location from "expo-location";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
export default function Map() {
  const {
    userLatitude,
    userLongitude,
    userAddress,
    destinationLatitude,
    destinationLongitude,
    destinationAddress,
    setUserLocation,
  } = useLocationStore();

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current && userLatitude && userLongitude) {
      const region: LatLng & { latitudeDelta: number; longitudeDelta: number } =
        {
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
      mapRef.current.animateToRegion(region, 500);
    }
  }, [userLatitude, userLongitude]);

  useEffect(() => {
    if (mapRef.current && destinationLatitude && destinationLongitude) {
      const region = {
        latitude: destinationLatitude,
        longitude: destinationLongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region, 500);
    }
  }, [destinationLatitude, destinationLongitude]);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      // setCurrentLocation(location.coords);

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: "Your Location",
      });
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLatitude || 37.78825,
          longitude: userLongitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLatitude && userLongitude && (
          <Marker
            coordinate={{ latitude: userLatitude, longitude: userLongitude }}
            title="My Location"
            description={userAddress || " Your Location"}
          />
        )}
        {destinationLatitude && destinationLongitude && (
          <Marker
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            description={destinationAddress || "Your Destination"}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});
