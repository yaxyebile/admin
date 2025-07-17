import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import type { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    subcategories: [] as Array<{ name: string; slug: string; description: string }>,
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateCategory((editingCategory as any)._id || editingCategory.id, {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        subcategories: formData.subcategories.map((sub, index) => ({
          id: `${(editingCategory as any)._id || editingCategory.id}-${index}`,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
        })),
        image: formData.image,
      });
    } else {
      addCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        subcategories: formData.subcategories.map((sub, index) => ({
          id: `${Date.now()}-${index}`,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
        })),
        image: formData.image,
      });
    }
    
    handleCloseForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      subcategories: category.subcategories.map(sub => ({
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
      })),
      image: category.image || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(undefined);
    setFormData({
      name: '',
      slug: '',
      description: '',
      subcategories: [],
      image: '',
    });
  };

  const addSubcategory = () => {
    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { name: '', slug: '', description: '' }],
    }));
  };

  const updateSubcategory = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) =>
        i === index ? { ...sub, [field]: value } : sub
      ),
    }));
  };

  const removeSubcategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-primary hover:text-primary-dark p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete((category as any)._id || category.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{category.description}</p>
            
            {(category.subcategories && category.subcategories.length > 0) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Subcategories:</h4>
                <div className="space-y-1">
                  {(category.subcategories || []).map((sub, index) => (
                    <div key={sub.id || sub.slug || sub.name || index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {sub.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Category Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium mb-1 text-orange-600 font-sans">Subcategories</label>
                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    Add Subcategory
                  </button>
                </div>
                
                {formData.subcategories.map((sub, index) => (
                  <div key={index} className="border rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Subcategory name"
                        value={sub.name}
                        onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Subcategory slug"
                        value={sub.slug}
                        onChange={(e) => updateSubcategory(index, 'slug', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={sub.description}
                        onChange={(e) => updateSubcategory(index, 'description', e.target.value)}
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubcategory(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {editingCategory ? 'Update' : 'Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;