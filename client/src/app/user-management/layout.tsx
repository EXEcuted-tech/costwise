"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider } from "@/context/SidebarContext";

export default function UserManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex">
        <MainLayout/>
        <main className="bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
