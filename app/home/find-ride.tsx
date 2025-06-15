import Map from "@/components/Map";
import FindRideModal from "@/components/modals/findRide";
// import React, { useState } from "react";
// import { StyleSheet, View } from "react-native";

// const FindRide = () => {
//   const [showModal, setShowModal] = useState(true);

//   return (
//     <View style={styles.fullScreen}>
//       <Map />
//       <FindRideModal
//         showModal={showModal}
//         updateShowModal={() => setShowModal(!showModal)}
//       />
//     </View>
//   );
// };

// export default FindRide;

// const styles = StyleSheet.create({
//   fullScreen: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const screenHeight = Dimensions.get("window").height;
const App = () => {
  const snapPoints = useMemo(() => ["60%", "100%", "55%"], []);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <>
      <GestureHandlerRootView>
        <Map />

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView>
            <FindRideModal />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
});

export default App;
