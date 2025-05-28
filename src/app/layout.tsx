// src/app/layout.tsx
import type { Metadata } from "next";
import "./(app)/globals.css";
import { headers } from 'next/headers'; // Importáljuk a 'headers' függvényt

export const metadata: Metadata = {
    title: "BME Formula Racing Team",
    description: "Formula Student Team from Budapest University of Technology and Economics",
};

// A RootLayout függvényt async-ké tesszük
export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    // Használjuk az 'await' kulcsszót a headers() hívásnál
    const headersList = await headers();
    // A 'x-pathname' fejléc tartalmazza az aktuális útvonalat
    const pathname = headersList.get('x-pathname') || '/';

    // Ellenőrizzük, hogy az útvonal az admin panelhez tartozik-e
    // A te esetedben az admin útvonal '/admin' vagy '/admin/...'
    const isAdminRoute = pathname.startsWith('/admin');

    return (
        <html lang="en">
        <body>
        {isAdminRoute ? (
            children
        ) : (
            <div className="min-h-screen bg-black text-white font-frtszoveg pb-20">
                {children}
            </div>
        )}
        </body>
        </html>
    );
}