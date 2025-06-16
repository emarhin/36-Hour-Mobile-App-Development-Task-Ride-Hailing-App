import Map from "@/components/Map";
import DriverConfirmationScreen from "@/components/modals/confirmdriver";
import FindRideModal from "@/components/modals/findRide";
import VehicleTypeModal from "@/components/modals/Vehicles";
import { SheetWrapper } from "@/components/sheetswrapper";
import { useAuth } from "@/context/authContext";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const sheetRef: any = useRef<BottomSheet>(null);
  const [activeModal, setActiveModal] = useState<
    "find" | "vechile" | "confirm_driver" | null
  >("find");
  // Add profile dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const route = useRouter();

  const openModal = (name: "find" | "vechile" | "confirm_driver") => {
    setActiveModal(name);
    sheetRef.current?.present();
  };

  // Profile dropdown toggle
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };
  const { Logout } = useAuth();

  const content =
    activeModal === "find" ? (
      <FindRideModal openModal={() => openModal("vechile")} />
    ) : activeModal === "vechile" ? (
      <VehicleTypeModal
        openModal={() => openModal("confirm_driver")}
        back={() => openModal("find")}
      />
    ) : activeModal === "confirm_driver" ? (
      <DriverConfirmationScreen openModal={() => openModal("find")} />
    ) : null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white relative">
        <Map />

        {/* Profile Icon at Top Right */}
        <TouchableOpacity
          className="absolute top-12 right-4 z-10 bg-gray-200 p-3 rounded-full"
          onPress={toggleProfileDropdown}
          style={styles.profileButton}
        >
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/68.jpg" }}
            style={{ width: 24, height: 24, borderRadius: 12 }}
          />
        </TouchableOpacity>

        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <View className="absolute top-24 right-4 bg-white shadow-lg rounded-lg z-20 w-48">
            <View className="p-4 border-b border-gray-200">
              <Text className="font-semibold">Emmanuel Arhin</Text>{" "}
              {/* Replace with actual username */}
            </View>
            <TouchableOpacity
              className="p-4 flex-row items-center"
              onPress={() => {
                Logout();
              }}
            >
              <Text className="text-red-500 ml-2">Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <SheetWrapper ref={sheetRef} content={content} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
