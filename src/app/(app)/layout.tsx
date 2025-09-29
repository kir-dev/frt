import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {ThemeProvider} from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "BME Formula Racing Team",
  description: "Formula Student Team from Budapest University of Technology and Economics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="hu">
        <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.19/index.global.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.19/index.global.min.css" />
        </head>
        <body>
        <ThemeProvider defaultTheme="dark" storageKey="bme-frt-theme">
            <div className="min-h-screen font-frtszoveg bg-black dark:bg-black light:bg-white text-white dark:text-white light:text-gray-900">
                <Navbar />
                <main className="pt-20 bg-black dark:bg-black light:bg-white text-white dark:text-white light:text-gray-900">
                    {children}
                </main>
            </div>
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}
