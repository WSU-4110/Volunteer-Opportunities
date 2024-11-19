import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const raleWayFont = localFont({
  src: "/fonts/Raleway-Regular.woff",
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Volunteer Opportunities",
  description: "Become a Volunteer and Make the World a Better Place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="hidden-scrollbar">
      <body className={`${raleWayFont.className} antialiased`}>
        <SessionProvider>
          <div className="flex flex-col min-h-screen w-full h-full">
            <div className="flex-grow">
              <Navbar />
              {children}
            </div>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
