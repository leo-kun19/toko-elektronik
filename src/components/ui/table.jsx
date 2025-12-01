import React from "react";

export default function Table({ columns, data, renderRow }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="text-left p-4 text-sm text-gray-600">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t last:border-b">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
