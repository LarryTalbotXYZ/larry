import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "$LARRY - The Werewolf Meme Coin",
  description: "Join the pack with $LARRY - The most howl-arious meme coin on the blockchain!",
  icons: {
    icon: '/fonts/logo32x32.png',
    apple: '/fonts/logo32x32.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-black text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
