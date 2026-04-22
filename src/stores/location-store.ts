import { create } from "zustand";
import { Location } from "../../convex/schemas/location.schema";

type LocationStore = {
  origin: Location | null;
  destination: Location | null;
  setOrigin: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;
  clearLocations: () => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  origin: null,
  destination: null,
  setOrigin: (location) => set({ origin: location }),
  setDestination: (location) => set({ destination: location }),
  clearLocations: () => set({ origin: null, destination: null }),
}));