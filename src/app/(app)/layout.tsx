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
        <html><body>
        <ThemeProvider defaultTheme="dark" storageKey="bme-frt-theme">
            <div className="min-h-screen bg-black dark:bg-black light:bg-white text-white dark:text-white light:text-gray-900">
                <Navbar />
                <main className="pt-21 bg-black dark:bg-black light:bg-white text-white dark:text-white light:text-gray-900">
                    {children}
                </main>
            </div>
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}
