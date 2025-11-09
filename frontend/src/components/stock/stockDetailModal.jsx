import React from "react";
import Modal from "../ui/Modal";
import { formatIDR } from "../../utils/currency";

export default function StockDetailModal({ open, onClose, item }) {
  if (!item) return null;
  return (
    <Modal open={open} onClose={onClose} width="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">Detail Barang Masuk</h2>
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div>
          <div className="text-xs text-gray-400">Brand</div>
          <div className="mt-1 font-medium text-gray-800">{item.brand}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Barang</div>
          <div className="mt-1 font-medium text-gray-800">{item.name}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Series</div>
          <div className="mt-1 font-medium text-gray-800">{item.series}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Kuantitas</div>
          <div className="mt-1 font-medium text-gray-800">{item.stock}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Harga per Barang</div>
          <div className="mt-1 font-medium text-gray-800">
            {formatIDR(item.price)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total</div>
          <div className="mt-1 font-medium text-gray-800">
            {formatIDR(item.price * item.stock)}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Supplier</div>
          <div className="mt-1 font-medium text-gray-800">{item.supplier}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Kontak</div>
          <div className="mt-1 font-medium text-gray-800">{item.contact}</div>
        </div>
      </div>
    </Modal>
  );
}
