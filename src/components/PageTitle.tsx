import React from "react";

export default function PageTitle({ title }: { title: string }) {
    return (
        <>
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-2xl font-bold tracking-tigh">
                        {title}
                    </h2>
                </div>
            </div>
        </>
    );
}