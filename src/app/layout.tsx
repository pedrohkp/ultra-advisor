import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ultra Advisor | Transforme IAs em Consultores de Elite",
  description: "Biblioteca de frameworks estratégicos prontos para uso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A1628] text-gray-100`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
