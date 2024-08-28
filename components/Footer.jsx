import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white p-8 mt-20">
      <div className="container mx-auto text-center">
        <Link href="/" className="flex justify-center mb-4">
          <h2 className="text-4xl font-bebas"><span className="text-lime-300">Hybrid</span>Coach</h2>
        </Link>

        <Link
          href="https://www.ericdaniels.dev/"
          target="_blank"
          className="text-neutral-300  hover:text-lime-300 transition-colors mb-2 inline-block text-base"
        >
          Made by{" "}
          <span className="underline italic">Eric Daniels</span>
        </Link>

        <p className="text-neutral-400 text-sm">
          Copyright © {new Date().getFullYear()} - All rights reserved
        </p>
      </div>
    </footer>
  );
}
