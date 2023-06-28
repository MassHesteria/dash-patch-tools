import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

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

export function RomInput({
  name,
  onLoad,
  children,
}: {
  name: string;
  onLoad: any;
  children: any;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);

  const internalCallback = (value: any) => {
    onLoad(value);
    setUploaded(true);
  };

  return (
    <div className="p-1">
      <Button
        variant={uploaded ? "destructive" : "default"}
        onClick={() => {
          if (input.current) {
            console.log(input.current);
            input.current.click();
          }
        }}
      >
        {children}
      </Button>
      <span className="pl-3">{uploaded ? "Loaded" : "Unloaded"}</span>
      <input
        type="file"
        id={name}
        ref={input}
        className="invisible"
        onChange={(e) => readRom(e.target, internalCallback)}
      ></input>
    </div>
  );
}
