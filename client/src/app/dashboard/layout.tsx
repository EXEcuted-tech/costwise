import MainLayout from "@/components/layouts/MainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CostWise | Dashboard",
  description: "Track performance metrics, products, and its costing to get insights in one place.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <MainLayout/>
      <main>
        {children}
      </main>
    </div>
  );
}
