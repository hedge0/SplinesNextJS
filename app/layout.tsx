import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata for the Next.js application, defining the title and description.
 */
export const metadata: Metadata = {
  title: "Hedge0-Splines",
  description: "A personal app designed to display and interpolate live options data.",
};

/**
 * RootLayout component that wraps the entire application, including navigation and layout structure.
 * 
 * @param {React.ReactNode} children - The child components or pages to render inside the layout.
 * @returns {JSX.Element} - The layout structure for the app, including the navigation bar and main content area.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen h-screen bg-gray-800`}>
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
