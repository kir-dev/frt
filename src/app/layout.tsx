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
        <html lang="en">
        <body>
        <div
            className="min-h-screen bg-black text-white font-frtszoveg pb-20">
            {children}
        </div>
        </body>
        </html>
    );
}
