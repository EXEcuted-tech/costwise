"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { useState, cloneElement } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import Header from "@/components/header/Header";
import { BiSearchAlt } from "react-icons/bi";

export default function AuditLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <SidebarProvider>
      <div className="flex w-screen">
        <MainLayout/>
        <main className="w-full">
          <Header icon={BiSearchAlt} title={"Audit Log"} />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}