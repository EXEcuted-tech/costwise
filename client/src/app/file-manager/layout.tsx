"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { FileTypeProvider, useFileType } from "@/context/FileTypeContext";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";

export default function FileManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <FileTypeProvider>
        <FileManagerContent>
          {children}
        </FileManagerContent>
      </FileTypeProvider>
    </SidebarProvider>
  );
}

function FileManagerContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarContext();
  const { fileType } = useFileType();

  return (
    <div className={`${fileType !== 2
      ?
      (isOpen ? 'w-[calc(100%-280px)] 2xl:w-full' : 'w-full')
      :
      (isOpen ? 'w-[calc(100%-500px)]' : 'w-[calc(100%-120px)]')} 
                    flex`}>
      <MainLayout />
      <main className={`w-full bg-background font-lato`}>
        {children}
      </main>
    </div>
  );
}
