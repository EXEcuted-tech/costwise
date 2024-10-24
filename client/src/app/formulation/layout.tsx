"use client"
import MainLayout from "@/components/layouts/MainLayout";
import Spinner from "@/components/loaders/Spinner";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { FormulationProvider, useFormulationContext } from "@/contexts/FormulationContext";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { Suspense, useEffect, useState } from "react";

export default function FormulationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
    <SidebarProvider>
      <FormulationProvider>
        <Suspense fallback={<div className="flex justify-center items-center w-full h-screen"><Spinner/></div>}>
          <FormulationContent>
            {children}
          </FormulationContent>
        </Suspense>
      </FormulationProvider>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function FormulationContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  const { edit, add, viewFormulas, viewBOM } = useFormulationContext();

  return (
    <div className="w-full flex">
      <MainLayout />
      <main className={`${isOpen && (edit || add) ? 'w-[calc(100%-280px)] 2xl:w-[calc(100%-360px)] ml-[280px] 2xl:ml-[360px]'
        : isOpen && (viewFormulas || viewBOM) ? 'w-[calc(100%-280px)] 2xl:w-[calc(100%-360px)] ml-[280px] 2xl:ml-[360px]'
          : isOpen ? 'w-[calc(100%-280px)] 2xl:w-full ml-[280px] 2xl:ml-[360px]'
            : edit || add ? 'w-[calc(100%-120px)] ml-[120px]'
              : viewFormulas || viewBOM ? 'w-[calc(100%-120px)] 3xl:w-full ml-[120px]'
                : 'w-[calc(100%-120px)] 2xl:w-full ml-[120px]'} 
                        min-h-screen font-lato bg-background dark:bg-[#1E1E1E] transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}