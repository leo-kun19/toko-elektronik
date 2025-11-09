import React from "react";

export default function Container({ children }) {
  return (
    <div className="flex-1 min-h-screen bg-[#F6F8FF] p-6 overflow-auto">
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </div>
  );
}
