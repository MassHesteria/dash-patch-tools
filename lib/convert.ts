export const PC_to_LoROM = (pc: number) => {
  let addr = ((pc << 1) & 0x7f0000) | (pc & 0x7fff) | 0x8000;
  return addr | 0x800000;
};

export const LoROM_to_PC = (lorom: number) => {
  return ((lorom >> 1) & 0x3f8000) | (lorom & 0x7fff);
};
