import React from "react";
import Table from "../ui/Table";
import { formatIDR } from "../../utils/currency";

export default function StockTable({ products, onView, onDelete }) {
  const columns = [
    { title: "Brand" },
    { title: "Nama Barang" },
    { title: "Series" },
    { title: "Harga" },
    { title: "Stok" },
    { title: "Action" },
  ];
  return (
    <Table
      columns={columns}
      data={products}
      renderRow={(p) => (
        <>
          <td className="p-4">{p.brand}</td>
          <td className="p-4">{p.name}</td>
          <td className="p-4">{p.series}</td>
          <td className="p-4">{formatIDR(p.price)}</td>
          <td className="p-4">{p.stock}</td>
          <td className="p-4 text-right">
            <button onClick={() => onView(p)} className="mr-3">
              👁️
            </button>
            <button onClick={() => onDelete(p.id)}>🗑️</button>
          </td>
        </>
      )}
    />
  );
}
