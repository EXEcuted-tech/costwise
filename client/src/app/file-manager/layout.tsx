"use client"
import MainLayout from "@/components/layouts/MainLayout";
import { FileTypeProvider, useFileType } from "@/context/FileTypeContext";
import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
import { useEffect, useState } from "react";

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
  const [isWorkspace,setIsWorkspace] = useState(false);
  
  useEffect(()=>{
    if(localStorage.getItem("wkspBool") === "true"){
      setIsWorkspace(true);
    }
  },[])

  return (
    <div className='w-full flex'>
      <MainLayout />
      <main className={`${isOpen && isWorkspace ? 'w-[calc(100%-280px)] 2xl:w-[calc(100%-360px)] ml-[280px] 2xl:ml-[360px]' : isOpen ? 'w-[calc(100%-280px)] 2xl:w-full ml-[280px] 2xl:ml-[360px]' : isWorkspace ? 'w-[calc(100%-120px)] ml-[120px]' : 'w-full ml-[120px]'} min-h-screen font-lato bg-background transition-all duration-400 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}