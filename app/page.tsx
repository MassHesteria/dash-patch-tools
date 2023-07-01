"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import gruvbox from "react-syntax-highlighter/dist/esm/styles/prism/gruvbox-dark";
import { Button } from "@/components/ui/button";
import { getModifiedRooms } from "@/lib/utils";
import { useState } from "react";
import { RomInput } from "@/components/rom-input";
import { type Room } from "@/lib/rooms";
import { superMetroidDecompress } from "@/lib/sm-decompress";
import { toHex } from "@/lib/convert";

const vanillaChecksum =
  "12b77c4bc9c1832cee8881244659065ee1d84c70c3d29e6eaf92e6798cc2ca72";

const printPatch = (vanilla: any, updated: any) => {
  const diff = [];

  for (let i = 0; i < updated.length; i++) {
    if (i < vanilla.length && vanilla[i] == updated[i]) {
      continue;
    }
    diff.push(i);
  }

  let result = [],
    temp = [],
    difference;
  for (let i = 0; i < diff.length; i += 1) {
    if (difference !== diff[i] - i) {
      if (difference !== undefined) {
        result.push(temp);
        temp = [];
      }
      difference = diff[i] - i;
    }
    temp.push(diff[i]);
  }

  if (temp.length) {
    result.push(temp);
  }

  let output = "";
  result.forEach((h) => {
    const offset = h[0];
    output += `dw $${toHex(offset, 4)},$${toHex(h.length, 4)}\n`;

    let line = "";
    for (let j = 0; j < h.length; j++) {
      if (line.length == 0) {
        line = "db ";
      } else if (line.length > 60) {
        output += line + "\n";
        console.log(line);
        line = "db ";
      } else if (line.length > 3) {
        line += ",";
      }
      line += "$" + toHex(updated[h[j]], 2);
    }

    if (line.length > 3) {
      output += line + "\n";
    }
  });

  output += "dw $FFFF\n";
  return output;
};

export default function Home() {
  const [vanillaBytes, setVanillaBytes] = useState(null);
  const [modifiedBytes, setModifiedBytes] = useState(null);
  const [modifiedRooms, setModifiedRooms] = useState<Room[]>([]);
  const [patchCode, setPatchCode] = useState("");

  const processRoom = async (name: string, address: number) => {
    // Utility routines.
    const snes2hex = (address: number) =>
      ((address >> 1) & 0x3f8000) | (address & 0x7fff);
    const extract = (rom: any) =>
      Buffer.from(superMetroidDecompress(rom, snes2hex(address), 0));

    // Decompress the data from the ROM files.
    const vanilla = extract(vanillaBytes);
    const updated = extract(modifiedBytes);

    if (vanilla.toString() == updated.toString()) {
      return "";
    }

    if (vanilla.length > updated.length) {
      console.log("vanilla length: ", vanilla.length);
      console.log("updated length: ", updated.length);
      throw new Error("length is different: not supported");
    }

    return `; ${name}\n` + printPatch(vanilla, updated);
  };

  const generateCode = async () => {
    let output = "";
    for (let i = 0; i < modifiedRooms.length; i++) {
      const r = modifiedRooms[i];
      const o = await processRoom(r.name, r.address);
      output += o;
    }
    setPatchCode(output);
  };

  const ModifiedRooms = () => {
    if (modifiedRooms.length <= 0) {
      return <></>;
    }

    return (
      <>
        {modifiedRooms.map((r) => {
          return (
            <div className="p-1" key={r.address}>
              {r.name}
            </div>
          );
        })}
        <Button onClick={() => generateCode()}>Generate ASM</Button>
      </>
    );
  };

  return (
    <main className="flex justify-center">
      <div id="left_side" className="w-1/2 h-screen pl-2">
        <div className="p-1">DASH Room Patcher</div>
        <RomInput name="vanillaRom" onLoad={setVanillaBytes}>
          Upload Vanilla Rom
        </RomInput>
        <RomInput name="modifiedRom" onLoad={setModifiedBytes}>
          Upload Modified Rom
        </RomInput>
        {vanillaBytes != null && modifiedBytes != null ? (
          <div className="p-1">
            <Button
              onClick={() => {
                setModifiedRooms(getModifiedRooms(vanillaBytes, modifiedBytes));
              }}
            >
              Process Files
            </Button>
            <ModifiedRooms />
          </div>
        ) : (
          ""
        )}
      </div>
      <div id="right_side" className="w-1/2 h-screen">
        <SyntaxHighlighter language="asm6502" style={gruvbox}>
          {patchCode}
        </SyntaxHighlighter>
      </div>
    </main>
  );
}
