import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import AuthContext from "@/lib/context/AuthContext";
import AuthroizationHeader from "@/lib/header/AuthrorizationHeader";
import StoreProvider from "@/lib/provider/StoreProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <AuthContext>
            <AuthroizationHeader>
              <Provider>
                {children}
                <Toaster />
              </Provider>
            </AuthroizationHeader>
          </AuthContext>
        </StoreProvider>
      </body>
    </html>
  );
}
