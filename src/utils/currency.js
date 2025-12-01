export function formatIDR(n) {
  if (typeof n !== "number") return n;
  return n.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}
