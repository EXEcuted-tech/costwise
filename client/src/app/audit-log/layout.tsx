"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { useState, cloneElement } from "react";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
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
        <DashboardContent>
          {children}
        </DashboardContent>
      </DrawerProvider>
    </SidebarProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  return (
    <div className="flex">
      <MainLayout />
      <main className={`w-full ${isOpen ? 'ml-[280px] 2xl:ml-[360px]' : 'ml-[120px]'} transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}