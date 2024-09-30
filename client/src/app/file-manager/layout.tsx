"use client"
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { FileManagerProvider } from '@/contexts/FileManagerContext';
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { Suspense, useEffect, useState } from "react";

export default function FileManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <FileManagerProvider>
        <Suspense fallback={<div>Loading workspace...</div>}>
            <FileManagerContent>
              {children}
            </FileManagerContent>
        </Suspense>
        </FileManagerProvider>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function FileManagerContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  const [isWorkspace, setIsWorkspace] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("wkspBool") === "true") {
      setIsWorkspace(true);
    }
  }, [])

  return (
    <div className='w-full flex'>
      <MainLayout />
      <main className={`${isOpen && isWorkspace ? 'w-[calc(100%-280px)] 2xl:w-[calc(100%-360px)] ml-[280px] 2xl:ml-[360px]' : isOpen ? 'w-[calc(100%-280px)] 2xl:w-full ml-[280px] 2xl:ml-[360px]' : isWorkspace ? 'w-[calc(100%-120px)] ml-[120px]' : 'w-full ml-[120px]'} min-h-screen font-lato bg-background transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}
