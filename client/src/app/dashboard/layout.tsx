'use client'
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider } from "@/context/SidebarContext";
import type { Metadata } from "next";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider>
      <div className="flex">
        <MainLayout/>
        <main>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
