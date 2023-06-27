import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoROM_to_PC } from "./convert";
import { type Room, Rooms } from "./rooms";
import { superMetroidDecompress, superMetroidReadCompressed } from "./sm-decompress";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getModifiedRooms(vanillaBytes: Uint8Array, modifiedBytes: Uint8Array): Room[] {
  return Rooms.filter((r) => {
    const vanillaRoom = superMetroidReadCompressed(vanillaBytes, LoROM_to_PC(r.address));
    const modifiedRoom = superMetroidReadCompressed(modifiedBytes, LoROM_to_PC(r.address));
    return vanillaRoom.toString() !== modifiedRoom.toString();
  });
}
