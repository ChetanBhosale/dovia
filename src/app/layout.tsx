import type { Metadata } from "next";
import { Geist, Geist_Mono,Chango } from "next/font/google";
import "./globals.css";
import TanStackProvider from "./provider/TanStackProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import {ClerkProvider} from "@clerk/nextjs";
import { BoomBoxIcon } from "lucide-react";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chango = Chango({
  variable: "--font-chango",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Dovia.AI",
  description: "Dovia.AI is a platform for building and deploying AI-powered applications.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Dovia.AI",
    description: "Dovia.AI is a platform for building and deploying AI-powered applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
  <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${chango.variable} antialiased`}
          >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TanStackProvider>
            {children}
            <Toaster />
          </TanStackProvider>
          </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>
  );
}
