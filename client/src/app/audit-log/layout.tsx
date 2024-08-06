"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { useState, cloneElement } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { BiSearchAlt } from "react-icons/bi";
import type { SVGProps } from 'react';
import { DrawerProvider } from "@/context/DrawerContext";

export default function AuditLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <SidebarProvider>
      <DrawerProvider>
        <div className="flex w-screen">
          <MainLayout/>
          <main className="w-full">
            {children}
          </main>
        </div>
      </DrawerProvider>
    </SidebarProvider>
  );
}