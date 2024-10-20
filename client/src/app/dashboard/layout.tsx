"use client"
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardContent>
          {children}
        </DashboardContent>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  return (
    <div className="flex">
      <MainLayout />
      <main className={`${isOpen ? 'w-[calc(100%-280px)] 3xl:w-full ml-[280px] 2xl:ml-[360px]' : 'w-[calc(100%-120px)] 2xl:w-full ml-[120px]'} min-h-screen font-lato bg-background dark:bg-[#1E1E1E] transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}