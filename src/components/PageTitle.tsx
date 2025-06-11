import React from "react";

type Props = {
    title: string;
    className?: string;
}
export default function PageTitle({ title, className = "" }: Props) {
    return (
        <>
            <div className="mb-12 font-frtFocimek">
                <div className="flex items-center gap-4 mb-4">
                    <h2 className={`text-2xl font-bold tracking-tigh ${className}`}>
                        {title}
                    </h2>
                </div>
            </div>
        </>
    );
}