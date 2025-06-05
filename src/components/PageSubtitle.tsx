import React from "react";

type Props = {
    title: string;
    className?: string;
};

export default function PageSubitle({ title, className = ""}: Props) {
    return (
        <>
            <div className="mb-12 font-frtFocimek">
                <div className="flex items-center gap-4 mb-4">
                    <h3 className={`text-xl font-bold tracking-tigh ${className}`}>
                        {title}
                    </h3>
                </div>
            </div>
        </>
    );
}