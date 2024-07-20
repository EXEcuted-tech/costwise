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
          <div className="relative z-10 flex-col sm:h-[60%] sm:w-[90%] w-[70%] h-[80%] rounded-3xl bg-white font-lato drop-shadow-3xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
