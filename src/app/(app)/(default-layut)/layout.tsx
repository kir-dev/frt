import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

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
            <Navbar/>
            <div
                className="min-h-screen bg-black text-white font-frtszoveg pt-16 pb-20"
                style={{minHeight: "100vh"}}
            >
                {children}
            </div>
            <Footer/>
        </body>
        </html>
    );
}
