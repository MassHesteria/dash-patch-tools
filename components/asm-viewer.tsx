import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import gruvbox from "react-syntax-highlighter/dist/esm/styles/prism/gruvbox-dark";

export function AsmViewer({ children }: { children: any }) {
  return (
    <SyntaxHighlighter language="asm6502" style={gruvbox}>
      {children}
    </SyntaxHighlighter>
  );
}
