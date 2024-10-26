"use client";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";

export default function FileManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <ProjectedCostingContent>{children}</ProjectedCostingContent>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function ProjectedCostingContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  return (
    <div className="w-full flex">
      <MainLayout />
      <main
        className={`${isOpen
          ? "w-[calc(100%-280px)] 2xl:w-[calc(100%-360px)] ml-[280px] 2xl:ml-[360px]"
          : isOpen
            ? "w-[calc(100%-280px)] 2xl:w-full ml-[280px] 2xl:ml-[360px]"
            : "w-full ml-[120px]"
          } min-h-screen font-lato bg-background dark:bg-[#121212] transition-all duration-400 ease-in-out`}
      >
        {children}
      </main>
    </div>
  );
}
