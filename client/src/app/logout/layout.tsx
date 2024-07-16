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
          style={{ backgroundImage: "url('/images/logoutbg.png')" }}
        >
          <div className="relative z-10 flex w-[50%] h-[80%] rounded-md">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
