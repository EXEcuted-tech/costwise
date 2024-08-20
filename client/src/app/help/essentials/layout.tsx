"use client"
import { useSidebarContext } from "@/context/SidebarContext";

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
      <main className={`${isOpen ? 'w-[full] 2xl:w-[full]' : isOpen ? 'w-[calc(100%-280px)] 2xl:w-full' : 'w-full'} min-h-screen font-lato bg-background transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}
