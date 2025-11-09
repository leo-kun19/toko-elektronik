import React from "react";
export default function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-md border bg-white"
      />
    </div>
  );
}
