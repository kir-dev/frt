import type { Metadata } from "next";
import "./(app)/globals.css";

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
        <div
            className="min-h-screen bg-black text-white font-frtszoveg pb-20"
            style={{ minHeight: "100vh" }}
        >
            {children}
        </div>
    );
}
