"use client"
import { SidebarProvider } from "@/context/SidebarContext";
import AccountCreation from "./user-management/create/AccountCreation";
import MainLayout from "@/components/layouts/MainLayout";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex">
        <MainLayout/>
        <main>
        <AccountCreation/>
        </main>
      </div>
    </SidebarProvider>
  );
}
