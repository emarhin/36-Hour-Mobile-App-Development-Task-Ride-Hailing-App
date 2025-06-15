/* eslint-disable react/display-name */
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";

type SheetWrapperProps = {
  content: React.ReactNode;
};

export const SheetWrapper = forwardRef<BottomSheet, SheetWrapperProps>(
  ({ content }, ref: any) => {
    const snapPoints = useMemo(() => ["60%", "80%"], []);
    const sheetRef = React.useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      present: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
      snapToIndex: (i: number) => sheetRef.current?.snapToIndex(i),
    }));

    return (
      <BottomSheet ref={sheetRef} snapPoints={snapPoints} index={0}>
        <BottomSheetView style={{ flex: 1 }}>{content}</BottomSheetView>
      </BottomSheet>
    );
  }
);
