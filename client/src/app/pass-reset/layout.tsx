"use client"
import { UserProvider } from "@/contexts/UserContext";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div
          className="min-h-screen bg-cover bg-center flex items-center justify-center h-screen"
          style={{ backgroundImage: "url('/images/virginiabg.png')" }}
        >
          <div className="absolute inset-0 bg-[#757575] opacity-[62%]"></div>
          {children}
        </div>
      </body>
    </html>
  );
}
