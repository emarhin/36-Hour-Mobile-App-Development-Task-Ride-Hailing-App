import { images } from "@/assets/constants";

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

export default vehicleTypes;
