import Map from "@/components/Map";
import DriverConfirmationScreen from "@/components/modals/confirmdriver";
import FindRideModal from "@/components/modals/findRide";
import VehicleTypeModal from "@/components/modals/Vehicles";
import { SheetWrapper } from "@/components/sheetswrapper";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const sheetRef: any = useRef<BottomSheet>(null);
  const [activeModal, setActiveModal] = useState<
    "find" | "vechile" | "confirm_driver" | null | undefined | null
  >("find");

  const openModal = (name: "find" | "vechile" | "confirm_driver") => {
    setActiveModal(name);
    sheetRef.current?.present();
  };

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
      <View className="flex-1 bg-white">
        <Map />
      </View>
      <SheetWrapper ref={sheetRef} content={content} />
    </GestureHandlerRootView>
  );
}
