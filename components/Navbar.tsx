"use client";
import { useState, useEffect, useRef } from "react";
import LogInButton from "@/components/auth/LogInButton";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  console.log("data", session);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const links = [
    { name: "Home", href: "/", public: true },
    { name: "About", href: "/#about", public: true },
    { name: "Dashboard", href: "/dashboard", public: false },
    { name: "New Workout", href: "/newWorkout", public: true },
    { name: "Demo", href: "/#demo", public: true },
    { name: "Pricing", href: "/#pricing", public: true },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 h-[8vh] w-full z-30 font-bebas tracking-wider text-xl ${
        !isMenuOpen && "overflow-x-hidden"
      }`}
    >
      <div className="bg-neutral-900/50 px-6 md:px-14 backdrop-blur w-full h-full flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <h2 className="text-2xl">
            <span className="text-lime-300">Hybrid</span>Coach
          </h2>
        </Link>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-neutral-200 focus:outline-none hover:text-lime-300 transition duration-300"
          >
            <svg
              className="w-8 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <ul
          ref={menuRef}
          className={`text-neutral-200 flex flex-col items-center justify-center gap-8 md:flex md:flex-row transition-transform duration-300 ease-in-out fixed md:static top-0 right-0 h-[100vh] md:h-auto w-3/4 md:w-auto bg-neutral-800 md:bg-transparent transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:transform-none p-4 md:p-0 z-40`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-neutral-200 md:hidden hover:text-lime-300 transition duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          {links.map(
            (link, index) =>
              (link.public || session?.user) && (
                <li
                  key={index}
                  className="my-2 md:my-0 hover:text-lime-300 transition duration-300 font-medium"
                  onClick={toggleMenu}
                >
                  <Link href={link.href}>{link.name}</Link>
                </li>
              )
          )}
          {session && session?.user ? (
            <li
              className="my-2 md:my-0 hover:text-lime-300 transition duration-300 font-medium"
              onClick={() => signOut()}
            >
              <a>Logout</a>
            </li>
          ) : (
            <li className="my-2 md:my-0 hover:text-lime-300 transition duration-300 font-medium">
              <LogInButton />
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
