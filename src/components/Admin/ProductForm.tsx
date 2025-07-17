import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct, categories } = useProducts();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    image: '',
    category: '',
    subcategory: '',
    stock: '',
    featured: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug || '',
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        category: product.category,
        subcategory: product.subcategory || '',
        stock: product.stock.toString(),
        featured: product.featured,
      });
    }
  }, [product]);

  const selectedCategory = categories.find(cat => cat.slug === formData.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      stock: parseInt(formData.stock),
      featured: formData.featured,
    };

    if (product) {
      updateProduct(product.id || product.id, productData);
    } else {
      addProduct(productData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-orange-50 placeholder:text-orange-400 text-orange-900 font-sans"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-orange-50 placeholder:text-orange-400 text-orange-900 font-sans"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-orange-50 placeholder:text-orange-400 text-orange-900 font-sans"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-orange-50 placeholder:text-orange-400 text-orange-900 font-sans"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-orange-50 placeholder:text-orange-400 text-orange-900 font-sans"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-orange-50 text-orange-900 font-sans"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && selectedCategory.subcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Subcategory</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-orange-50 text-orange-900 font-sans"
              >
                <option value="">Select a subcategory</option>
                {selectedCategory.subcategories.map((subcategory, index) => (
                  <option key={subcategory.id || subcategory.slug || subcategory.name || index} value={subcategory.slug}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
              className="w-full p-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-orange-50 placeholder:text-orange-400 text-orange-900 font-sans"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="mr-2 accent-orange-500"
            />
            <label className="text-sm font-medium text-orange-600 font-sans">Featured Product</label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;