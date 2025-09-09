"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Folktales</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-green-500 transition ${
                pathname === link.href
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col p-6`}
      >
        {/* First Link + Close Button horizontally aligned */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={links[0].href}
            onClick={() => setIsOpen(false)}
            className={`text-lg font-medium hover:text-green-500 ${
              pathname === links[0].href ? "text-green-600" : "text-gray-900"
            }`}
          >
            {links[0].name}
          </Link>
          <button
            className="text-2xl text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Remaining Links */}
        {links.slice(1).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={`mb-6 text-lg font-medium hover:text-green-500 ${
              pathname === link.href ? "text-green-600" : "text-gray-900"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
