"use client";

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-black/90 backdrop-blur-sm z-50 border-b border-purple-500/10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo32x32.png"
              alt="LARRY Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-2xl font-bold text-white">LARRY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#tokenomics" className="text-gray-300 hover:text-white transition-colors">
              Tokenomics
            </Link>
            <Link href="/#stats" className="text-gray-300 hover:text-white transition-colors">
              Protocol Stats
            </Link>
            <Link href="/#strategies" className="text-gray-300 hover:text-white transition-colors">
              Strategies
            </Link>
            <a 
              href="https://basescan.org/address/0x8F85710fEf0f3c024B9E21B98d8D7F4D3f4d96aE" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Contract
            </a>
            <Link 
              href="/dashboard" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Launch App
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm p-4 border-b border-purple-500/10">
            <div className="flex flex-col space-y-4">
              <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/#tokenomics" className="text-gray-300 hover:text-white transition-colors">
                Tokenomics
              </Link>
              <Link href="/#stats" className="text-gray-300 hover:text-white transition-colors">
                Protocol Stats
              </Link>
              <Link href="/#strategies" className="text-gray-300 hover:text-white transition-colors">
                Strategies
              </Link>
              <a 
                href="https://basescan.org/address/0x8F85710fEf0f3c024B9E21B98d8D7F4D3f4d96aE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Contract
              </a>
              <Link 
                href="/dashboard" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium text-center transition-colors"
              >
                Launch App
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
