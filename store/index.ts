import { create } from "zustand";

import driverInfo from "@/data/driverinfo";

export const useLocationStore = create<any>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // if driver is selected and now new location is set, clear the selected driver
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
  reset: () =>
    set(() => ({
      userLatitude: null,
      userLongitude: null,
      userAddress: null,
      destinationLatitude: null,
      destinationLongitude: null,
      destinationAddress: null,
    })),
}));

export const useDriverStore = create<any>((set, get) => ({
  drivers: [driverInfo],
  selectedDriver: driverInfo,
  vehiclePicked: "",
  distanceRemaingToReachUser: 0,
  driverComing: false,
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),
  setDrivers: (drivers: any) => set(() => ({ drivers })),
  setVehiclePicked: (vehicle: string) =>
    set(() => ({ vehiclePicked: vehicle, selectedDriver: null })),
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
  setDistanceRemaingToReachUser: (value: boolean) =>
    set(() => ({ distanceRemaingToReachUser: value })),
  setDriverComing: (value: boolean) => set(() => ({ driverComing: value })),
}));
