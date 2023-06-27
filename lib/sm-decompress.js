export const superMetroidDecompress = (rom, address, logLevel = 1) => {
  const dv = new DataView(rom.buffer);
  let pos = address;

  const read1 = () => {
    const ret = dv.getUint8(pos);
    pos += 1;
    return ret;
  };
  const read2 = () => {
    const ret = dv.getUint16(pos, true);
    pos += 2;
    return ret;
  };

  let decompressed = [];

  while (true) {
    const byte = read1();

    if (byte == 0xff) {
      break;
    }

    let type = byte >> 5;

    let size = (byte & 0x1f) + 1;

    if (type == 7) {
      size = (((byte & 0x3) << 8) | read1()) + 1;
      type = (byte >> 2) & 0x7;
    }

    if (logLevel == 2) {
      console.log("Type: %i, Size: %i, Pos: %i", type, size, decompressed.length);
      console.log(byte.toString(16));
    }

    if (type == 0) {
      for (let i = 0; i < size; i++) {
        decompressed.push(rom[pos + i]);
      }
      pos += size;
    } else if (type == 1) {
      const val = read1();
      for (let i = 0; i < size; i++) {
        decompressed.push(val);
      }
    } else if (type == 2) {
      const a = read1();
      const b = read1();
      const c = size >> 1;
      for (let i = 0; i < c; i++) {
        decompressed.push(a, b);
      }
      if (size & (0x1 == 1)) {
        decompressed.push(a);
      }
    } else if (type == 3) {
      const a = read1();
      for (let i = a; i < a + size; i++) {
        decompressed.push(i);
      }
    } else if (type == 4) {
      const offset = read2();
      for (let i = offset; i < offset + size; i++) {
        decompressed.push(decompressed[i]);
      }
    } else if (type == 5) {
      const offset = read2();
      for (let i = offset; i < offset + size; i++) {
        decompressed.push(decompressed[i] ^ 0xff);
      }
    } else if (type == 6) {
      const offset = decompressed.length - read1();
      for (let i = offset; i < offset + size; i++) {
        decompressed.push(decompressed[i]);
      }
    } else if (type == 7) {
      const offset = decompressed.length - read1();
      for (let i = offset; i < offset + size; i++) {
        decompressed.push(decompressed[i] ^ 0xff);
      }
    }
  }

  if (logLevel > 0) {
    console.log("Decompressed %i bytes to %i bytes", pos - address, decompressed.length);
  }

  return decompressed;
};

export const superMetroidReadCompressed = (rom, address) => {
  const dv = new DataView(rom.buffer);
  let pos = address;

  const read1 = () => {
    const ret = dv.getUint8(pos);
    pos += 1;
    return ret;
  };
  const read2 = () => {
    const ret = dv.getUint16(pos, true);
    pos += 2;
    return ret;
  };

  let decompressed = [];

  while (true) {
    const byte = read1();

    if (byte == 0xff) {
      break;
    }

    let type = byte >> 5;

    let size = (byte & 0x1f) + 1;

    if (type == 7) {
      size = (((byte & 0x3) << 8) | read1()) + 1;
      type = (byte >> 2) & 0x7;
    }

    if (type == 0) {
      for (let i = 0; i < size; i++) {
        decompressed.push(rom[pos + i]);
      }
      pos += size;
    } else if (type == 1) {
      const val = read1();
      for (let i = 0; i < size; i++) {
        decompressed.push(val);
      }
    } else if (type == 2) {
      const a = read1();
      const b = read1();
      const c = size >> 1;
      for (let i = 0; i < c; i++) {
        decompressed.push(a, b);
      }
      if (size & (0x1 == 1)) {
        decompressed.push(a);
      }
    } else if (type == 3) {
      const a = read1();
      for (let i = a; i < a + size; i++) {
        decompressed.push(i);
      }
    } else if (type == 4) {
      const offset = read2();
      for (let i = offset; i < offset + size; i++) {
        decompressed.push(decompressed[i]);
      }
    } else if (type == 5) {
      const offset = read2();
      for (let i = offset; i < offset + size; i++) {
        decompressed.push(decompressed[i] ^ 0xff);
      }
    } else if (type == 6) {
      const offset = decompressed.length - read1();
      for (let i = offset; i < offset + size; i++) {
        decompressed.push(decompressed[i]);
      }
    } else if (type == 7) {
      const offset = decompressed.length - read1();
      for (let i = offset; i < offset + size; i++) {
        decompressed.push(decompressed[i] ^ 0xff);
      }
    }
  }

  let compressed = new Uint8Array(pos - address);
  let index = 0;
  for (let i = address; i < pos; i++) {
    compressed[index++] = rom[i];
  }

  return compressed;
};
