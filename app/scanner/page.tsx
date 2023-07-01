"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import gruvbox from "react-syntax-highlighter/dist/esm/styles/prism/gruvbox-dark";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RomInput } from "@/components/rom-input";
import { IpsPatch, IpsHunk } from "@/lib/ips-patch";
import { PC_to_LoROM, toHex } from "@/lib/convert";

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
        for (let j = 0; j < hunk.length; j++) {
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
      <div id="left_side" className="w-1/2 h-screen pl-2">
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
      <div id="right_side" className="w-1/2 h-screen">
        <SyntaxHighlighter language="asm6502" style={gruvbox}>
          {patchCode}
        </SyntaxHighlighter>
      </div>
    </main>
  );
}
