"use client";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";

export default function CostCalculationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
    <SidebarProvider>
      <div className="flex font-lato">
        <MainLayout/>
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
}

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebarContext();
  
  return (
    <main className={`h-screen ${isOpen ? 'w-[calc(100%-280px)] ml-[280px] 2xl:ml-[360px] 2xl:w-[calc(100%-360px)] xl:w-[calc(100%-280px)]' : 'w-[calc(100%-120px)] ml-[120px]'} bg-background transition-all duration-200 ease-in-out`}>
      {children}
    </main>
  );
};
