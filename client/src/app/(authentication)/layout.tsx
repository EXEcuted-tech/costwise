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
          <div className="relative z-10 flex-col h-[670px] w-[350px] sm:w-[500px] lg:w-[900px] 2xl:w-[1100px] rounded-3xl bg-white font-lato drop-shadow-3xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
