"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { useState, cloneElement } from "react";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
import background from '@/assets/account-profile-bg.png';
import { BiSearchAlt } from "react-icons/bi";
import type { SVGProps } from 'react';


export default function AccountProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <SidebarProvider>
        <DashboardContent>
            {children}
        </DashboardContent>
    </SidebarProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  return (
    <div className='flex w-full h-screen bg-cover bg-center'style={{ backgroundImage: `url(${background.src})` }}>
      <MainLayout />
      <main className={`w-full ${isOpen ? 'ml-[280px] 2xl:ml-[360px]' : 'ml-[120px]'} transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}