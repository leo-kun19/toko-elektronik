import { useState } from 'react';

export const useProducts = (initialProducts) => {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (newProduct) => {
    setProducts([...products, {
      id: Date.now(),
      ...newProduct
    }]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id, updatedData) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  return {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    getProductById
  };
};