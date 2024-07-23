"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider } from "@/context/SidebarContext";

export default function FileManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex">
        <MainLayout/>
        <main className='w-full bg-background font-lato'>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
