"use client"
import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SilentModeProvider } from "@/contexts/SilentModeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SilentModeProvider>
        <UserProvider>
          <NotificationProvider>
            <body>{children}</body>
          </NotificationProvider>
        </UserProvider>
      </SilentModeProvider>
    </html>
  );
}
