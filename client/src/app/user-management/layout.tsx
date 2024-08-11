"use client";
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";

export default function UserManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex font-lato">
        <MainLayout/>
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebarContext();
  
  return (
    <main className={`w-full h-screen ${isOpen ? 'w-[calc(100%-280px)] ml-[280px] 2xl:ml-[360px] 2xl:w-[calc(100%-360px)]' : 'ml-[120px]'} bg-background transition-all duration-200 ease-in-out`}>
      {children}
    </main>
  );
};
