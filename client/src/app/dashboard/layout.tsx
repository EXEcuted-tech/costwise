"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <div className="flex">
      <MainLayout />
      <main className={`${isOpen ? 'ml-[280px] 2xl:ml-[360px]' : 'ml-[120px]'} w-full transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}