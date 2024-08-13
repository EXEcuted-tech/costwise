"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";

export default function FormulationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <FormulationContent>
        {children}
      </FormulationContent>
    </SidebarProvider>
  );
}

function FormulationContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  return (
    <div className="flex">
      <MainLayout />
      <main className={`w-full ${isOpen ? 'ml-[280px] 2xl:ml-[360px]' : 'ml-[120px]'} min-h-screen font-lato bg-background transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}