import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import clsx from "clsx";

import "./globals.css";

const prompt = Prompt({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "My Application",
  description:
    "A full-stack application built with NestJS and Next.js",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={clsx(prompt.variable, "antialiased")}>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}
