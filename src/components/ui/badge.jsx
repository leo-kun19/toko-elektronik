import React from "react";
export default function Badge({
  children,
  color = "bg-green-100 text-green-700",
}) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm ${color}`}>
      {children}
    </span>
  );
}
