"use client";

import { Button } from "@/components/ui/button";
import { getModifiedRooms } from "@/lib/utils";
import { useRef, useState } from "react";
import styles from "./page.module.css";

const vanillaChecksum = "12b77c4bc9c1832cee8881244659065ee1d84c70c3d29e6eaf92e6798cc2ca72";

function readRom(el: HTMLInputElement, callback: (value: any) => void) {
  if (!el || !el.files) {
    return;
  }
  let rom = el.files[0];
  let reader = new FileReader();

  reader.onload = async function () {
    try {
      const bytes = await new Uint8Array(reader.result as ArrayBuffer);
      await callback(bytes);
    } catch (e) {
      const err = e as Error;
      console.error(err.message);
      // TODO: Present a friendly error message to the user instead of an alert.
      alert(err.message);
      el.value = "";
    }
  };

  reader.onerror = function () {
    alert("Failed to load file.");
  };

  reader.readAsArrayBuffer(rom);
}

export default function Home() {
  const [vanillaBytes, setVanillaBytes] = useState(null);
  const [modifiedBytes, setModifiedBytes] = useState(null);
  const uploadVanilla = useRef<HTMLInputElement>(null);
  const uploadModified = useRef<HTMLInputElement>(null);

  return (
    <main className={styles.front}>
      <div className={styles.header}>DASH Room Patcher</div>
      <div className={styles.rom_button}>
        <Button
          onClick={() => {
            if (uploadVanilla.current) {
              uploadVanilla.current.click();
            }
          }}
        >
          Upload Vanilla Rom
        </Button>
        <span>{vanillaBytes != null ? "Loaded" : "Unloaded"}</span>
        <input
          type="file"
          id="vanilla_rom"
          ref={uploadVanilla}
          className="invisible"
          onChange={(e) => {
            readRom(e.target, (value) => {
              //TODO: Verify checksum
              console.log("vanilla:", value);
              setVanillaBytes(value);
            });
          }}
        ></input>
      </div>
      <div className={styles.rom_button}>
        <Button
          onClick={() => {
            if (uploadModified.current) {
              uploadModified.current.click();
            }
          }}
        >
          Upload Modified Rom
        </Button>
        <span>{modifiedBytes != null ? "Loaded" : "Unloaded"}</span>
        <input
          type="file"
          id="modified_rom"
          ref={uploadModified}
          className="invisible"
          onChange={(e) => {
            readRom(e.target, (value) => {
              console.log("modified:", value);
              setModifiedBytes(value);
            });
          }}
        ></input>
      </div>
      {vanillaBytes != null && modifiedBytes != null ? (
        <div className={styles.rom_button}>
          <Button
            variant="secondary"
            onClick={() => console.log(getModifiedRooms(vanillaBytes, modifiedBytes))}
          >
            Process Files
          </Button>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}
