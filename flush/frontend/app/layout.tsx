import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" className="dark scheme-only-dark">
      <SessionProvider session={session}>
        <body className={`${fontSans.variable} font-sans antialiased`}>
          {children}
          <Toaster richColors />
        </body>
      </SessionProvider>
    </html>
  );
}
