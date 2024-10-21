"use client"
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";


export default function ProfileLayout({
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
    <div className='flex w-full h-screen'>
      <MainLayout />
      <main className={`w-full ${isOpen ? 'ml-[280px] 2xl:ml-[360px]' : 'ml-[120px]'} transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}