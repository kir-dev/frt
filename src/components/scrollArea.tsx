import React from "react";

interface ScrollAreaProps {
  height?: string; // e.g. "h-64", "h-[300px]"
  width?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ScrollArea({
  height = "h-25",
  width = "w-25",
  children,
  className = "",
}: ScrollAreaProps) {
  return (
    <div className={`overflow-y-auto ${height} ${width} pt-2 ${className}`}>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
