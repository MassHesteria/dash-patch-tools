import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Room, Rooms } from "./rooms";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getModifiedRooms(vanillaBytes: Uint8Array, modifiedBytes: Uint8Array): Room[] {
  return Rooms;
}
