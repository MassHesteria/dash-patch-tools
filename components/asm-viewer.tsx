import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import gruvbox from "react-syntax-highlighter/dist/esm/styles/prism/gruvbox-dark";

export function AsmViewer({ children }: { children: any }) {
  //TODO: This feels ugly
  const bgColor = gruvbox[':not(pre) > code[class*="language-"]']
    .background as string;
  const bgStyle = {
    backgroundColor: bgColor,
  };
  return (
    <div className="h-screen overflow-auto" style={bgStyle}>
      <SyntaxHighlighter language="asm6502" style={gruvbox}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
