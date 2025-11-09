import React from "react";

export default function Modal({
  open,
  onClose,
  children,
  width = "max-w-2xl",
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 modal-backdrop flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-xl w-full ${width} relative`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400"
        >
          ✕
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
