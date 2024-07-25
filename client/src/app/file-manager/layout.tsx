"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";

export default function FileManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <FileManagerContent>
        {children}
      </FileManagerContent>
    </SidebarProvider>
  );
}

function FileManagerContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();

  return (
    <div className="flex">
      <MainLayout />
      <main className={`${isOpen ? 'w-[calc(100%-280px)] 2xl:w-full' : 'w-full'} bg-background font-lato`}>
        {children}
      </main>
    </div>
  );
}
