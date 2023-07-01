import Link from "next/link";

export default function Navigation() {
  return (
    <div className="absolute insert-x-2 bottom-2">
      <span className="italic pr-2">Navigation:</span>
      <Link href="/" className="pr-2">
        Room
      </Link>
      <Link href="/scanner" className="pr-2">
        Scanner
      </Link>
    </div>
  );
}
