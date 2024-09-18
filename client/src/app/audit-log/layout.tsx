"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { useState, cloneElement } from "react";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { BiSearchAlt } from "react-icons/bi";
import type { SVGProps } from 'react';
import { DrawerProvider } from "@/contexts/DrawerContext";


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
      <main className={`${isOpen ? 'w-[calc(100%-280px)] 2xl:w-full ml-[280px] 2xl:ml-[360px]' : 'w-full ml-[120px]'} min-h-screen font-lato bg-background transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}