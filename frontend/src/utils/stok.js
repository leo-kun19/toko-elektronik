export const countLowStockItems = (stokBarang) => {
    return stokBarang.filter(item => (item.stok || 0) < 5).length;
  };