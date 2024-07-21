import MainLayout from "@/components/layouts/MainLayout";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex">
        <MainLayout/>
        <main>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
