export const products = [
  {
    id: "p1",
    brand: "Samsung",
    name: "Refrigerator",
    series: "681L SBS - SpaceMax",
    price: 21000000,
    stock: 97,
    supplier: "PT. Pan Tech",
    contact: "+62 123456789",
  },
  {
    id: "p2",
    brand: "Hawlett Packard",
    name: "Kipas Angin",
    series: "FS1 A97",
    price: 350000,
    stock: 35,
    supplier: "PT. Windah Batusaudara",
    contact: "+62 81234567890",
  },
  {
    id: "p3",
    brand: "Phillips",
    name: "Lampu LED",
    series: "160W A80 E27",
    price: 400000,
    stock: 150,
    supplier: "CV. Jaya Persada",
    contact: "+62 81234567890",
  },
];

export const transactions = [
  {
    id: "t1",
    productId: "p1",
    qty: 2,
    total: 121.0,
    type: "out",
    status: "Pengeluaran",
  },
  {
    id: "t2",
    productId: "p2",
    qty: 35,
    total: 590.0,
    type: "out",
    status: "Pengeluaran",
  },
  {
    id: "t3",
    productId: "p3",
    qty: 150,
    total: 607.0,
    type: "in",
    status: "Pemasukan",
  },
];
