"use client";

import { Button } from "@/components/ui/button";
import { getModifiedRooms } from "@/lib/utils";
import { useState } from "react";
import styles from "./page.module.css";
import { RomInput } from "@/components/rom-input";

const vanillaChecksum =
  "12b77c4bc9c1832cee8881244659065ee1d84c70c3d29e6eaf92e6798cc2ca72";

export default function Home() {
  const [vanillaBytes, setVanillaBytes] = useState(null);
  const [modifiedBytes, setModifiedBytes] = useState(null);
  const [patchCode, setPatchCode] = useState("");

  return (
    <main className="flex justify-center">
      <div id="left_side" className="w-1/2 h-screen pl-2 mt-2">
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
                console.log(getModifiedRooms(vanillaBytes, modifiedBytes));
                setPatchCode("yo\nhow are you");
              }}
            >
              Process Files
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div id="right_side" className="w-1/2 h-screen mt-2">
        <div className="p-1">ASM</div>
        <div className="font-mono p-1 whitespace-pre">{patchCode}</div>
      </div>
    </main>
  );
}
