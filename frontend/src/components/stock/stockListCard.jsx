import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { formatIDR } from "../../utils/currency";

export default function StockListCard({ item, onView }) {
  return (
    <Card className="flex flex-col items-center text-center">
      <div className="w-28 h-28 bg-gray-100 rounded-md mb-3" />
      <div className="font-semibold">{item.name}</div>
      <div className="text-xs text-gray-400">{item.brand}</div>
      <div className="mt-3 text-sm font-semibold">{formatIDR(item.price)}</div>
      <button
        onClick={() => onView(item)}
        className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md"
      >
        Detail
      </button>
    </Card>
  );
}
