import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CursorFlare } from "@/components/resume/CursorFlare";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lakshay Verma - Portfolio",
  description: "Lead Solutions Architect & Systems Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CursorFlare />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
