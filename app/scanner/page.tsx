"use client";

import { AsmViewer } from "@/components/asm-viewer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RomInput } from "@/components/rom-input";
import { IpsPatch, IpsHunk } from "@/lib/ips-patch";
import { PC_to_LoROM, toHex } from "@/lib/convert";
import Navigation from "@/components/navigation";

export default function Scanner() {
  const [patchBytes, setPatchBytes] = useState(null);
  const [patchCode, setPatchCode] = useState("");

  const generateCode = async () => {
    const patch = new IpsPatch(patchBytes);
    let output = "";
    for (let i = 0; i < patch.hunks.length; i++) {
      const hunk = patch.hunks[i] as IpsHunk;
      if (i > 0) {
        output += "\n";
      }
      output += `org $${toHex(PC_to_LoROM(hunk.offset), 6)}`;
      if (hunk.rle) {
        const byte = hunk.payload[hunk.payloadIndex];
        output += `\nfillbyte $${toHex(byte, 2)}\nfill ${hunk.length}\n`;
      } else {
        const wordCount = Math.floor(hunk.length / 2);
        for (let j = 0; j < wordCount; j++) {
          const idx = j * 2;
          const one = hunk.payload[hunk.payloadIndex + idx + 1];
          const two = hunk.payload[hunk.payloadIndex + idx];
          if (j % 10 == 0) {
            output += `\ndw $${toHex(one, 2) + toHex(two, 2)}`;
          } else {
            output += `,$${toHex(one, 2) + toHex(two, 2)}`;
          }
        }
        for (let j = wordCount * 2; j < hunk.length; j++) {
          const byte = hunk.payload[hunk.payloadIndex + j];
          if (j % 12 == 0) {
            output += `\ndb $${toHex(byte, 2)}`;
          } else {
            output += `,$${toHex(byte, 2)}`;
          }
        }
      }
      output += "\n";
    }
    setPatchCode(output);
  };

  return (
    <main className="flex justify-center">
      <div id="left_side" className="w-1/3 h-screen pl-2">
        <div className="h-5/6">
          <div className="p-1">DASH Patch Scanner</div>
          <RomInput name="ipsPatch" onLoad={setPatchBytes}>
            Upload IPS Patch
          </RomInput>
          {patchBytes != null ? (
            <div className="p-1">
              <Button onClick={() => generateCode()}>Generate ASM</Button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="h-1/6 relative">
          <Navigation />
        </div>
      </div>
      <div id="right_side" className="w-2/3 h-screen">
        <AsmViewer>{patchCode}</AsmViewer>
      </div>
    </main>
  );
}
