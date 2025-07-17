import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, Category, ProductContextType } from '../types';
import * as api from '../api';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch products and categories from backend
  useEffect(() => {
    api.fetchProducts().then(data => {
      setProducts(data.map((p: any) => ({
        ...p,
        id: p._id || p.id,
      })));
    });
    api.fetchCategories().then(data => {
      setCategories(data.map((c: any) => ({
        ...c,
        image: c.image || '/default-category.png',
      })));
    });
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct = await api.createProduct(productData);
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const updated = await api.updateProduct(id, productData);
    setProducts(prev => prev.map(product => product.id === id ? updated : product));
  };

  const deleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    const newCategory = await api.createCategory(categoryData);
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    const updated = await api.updateCategory(id, categoryData);
    setCategories(prev => prev.map(category => category.id === id ? updated : category));
  };

  const deleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const getProductsByCategory = (categorySlug: string, subcategorySlug?: string) => {
    return products.filter(product => {
      if (subcategorySlug) {
        return product.category === categorySlug && product.subcategory === subcategorySlug;
      }
      return product.category === categorySlug;
    });
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const value: ProductContextType = {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory,
    getFeaturedProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 