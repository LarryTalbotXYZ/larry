import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-purple-500/10">
      <div className="container mx-auto px-4 py-12">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/images/logo32x32.png"
              alt="LARRY Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-white">LARRY</span>
          </div>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            ETH-backed DeFi protocol with innovative bonding curve mechanics.
          </p>
        </div>

        {/* Links */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:gap-8 gap-y-4 gap-x-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/#features" className="text-gray-400 hover:text-purple-400 transition-colors">
              Features
            </Link>
            <Link href="/#tokenomics" className="text-gray-400 hover:text-purple-400 transition-colors">
              Tokenomics
            </Link>
            <Link href="/#stats" className="text-gray-400 hover:text-purple-400 transition-colors">
              Protocol Stats
            </Link>
            <a 
              href="https://etherscan.io/token/0x888d81e3ea5E8362B5f69188CBCF34Fa8da4b888" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Contract
            </a>
          </div>
        </div>
          
        {/* Social Icons Row */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <a 
            href="https://x.com/LarryTalbotXYZ" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.73 10.86l5.05-5.87h-1.2l-4.38 5.1L9.6 5h-3.92l5.38 7.86L5.93 19h1.2l4.64-5.41L15.48 19h3.92l-5.67-8.14zm-1.54 1.8l-.53-.77-4.26-6.16h1.96l3.43 4.97.53.77 4.48 6.47h-1.96l-3.65-5.28z" />
            </svg>
          </a>
          <a 
            href="https://t.me/LarryTalbotXYZ" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
          <a 
            href="https://github.com/LarryTalbotXYZ" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </div>

        {/* Bottom */}
        <div className="border-t border-purple-500/10 mt-4 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 LARRY Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}