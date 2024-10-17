import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quote Data Chart",
  description: "A Next.js app displaying quote data in a chart",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-800 bg-[url('/purple-pattern.svg')] bg-repeat`}>
        <nav className="bg-gray-900 p-4">
          <ul className="flex space-x-4 justify-center">
            <li>
              <Link href="/" className="text-white hover:text-purple-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/models" className="text-white hover:text-purple-400 transition-colors">Models</Link>
            </li>
            <li>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">About</Link>
            </li>
          </ul>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}