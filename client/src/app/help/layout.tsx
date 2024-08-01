"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex font-lato">
        <MainLayout/>
        <main className="w-full bg-background -z-10">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
