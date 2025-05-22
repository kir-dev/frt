import React from "react";

export default function PageSubitle({ title }: { title: string }) {
    return (
        <>
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold tracking-tigh">
                        {title}
                    </h3>
                </div>
            </div>
        </>
    );
}