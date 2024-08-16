"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GettingStartedContent>
      {children}
    </GettingStartedContent>
  );
}

function GettingStartedContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  return (
    <div className="flex font-lato w-full">
      <main className="overflow-hidden ">
        {children}
      </main>
    </div>
  );
}
