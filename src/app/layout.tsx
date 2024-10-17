import type { Metadata } from "next";
import localFont from "next/font/local";
import MyMsalProvider from "@/msal/MyMsalProvider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ShopScan",
  description: "An app that checks items off your shopping list when you scan them",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-gray-100 flex flex-col p-2`}>
      <Analytics />  
      <MyMsalProvider>
          <main>
            {children}
          </main>
        </MyMsalProvider>
      </body>
    </html>
  );
}
