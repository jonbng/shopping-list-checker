import type { Metadata } from "next";
import localFont from "next/font/local";
import MyMsalProvider from "@/msal/MyMsalProvider";
import "./globals.css";
import UserAvatar from "@/components/UserAvatar";
import SignOutButton from "@/components/SignOutButton";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SHopping list checker",
  description: "An app that checks items off your shopping list when you scan them",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-gray-100 flex flex-col p-4`}>
        <MyMsalProvider>
          <main>
            <div className="w-full text-center">
              <h1 className="text-3xl font-bold text-gray-700 mb-2">
                You are logged in
              </h1>
              <div className="m-4">
                <UserAvatar showInfo={true} />
              </div>
              <SignOutButton />
            </div>
            {children}
          </main>
        </MyMsalProvider>
      </body>
    </html>
  );
}
