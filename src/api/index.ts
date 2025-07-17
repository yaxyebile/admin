const API_BASE = 'https://backend-ecomerce-1-gxbl.onrender.com/api';

// Products
export const fetchProducts = async () => {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
};

export const fetchProduct = async (id: string) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  return res.json();
};

export const createProduct = async (data: any) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateProduct = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  return res.json();
};

// Categories
export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
};

export const createCategory = async (data: any) => {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateCategory = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteCategory = async (id: string) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
  return res.json();
};

// Orders
export const createOrder = async (data: any) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch(`${API_BASE}/orders`);
  return res.json();
};

export const fetchUserOrders = async (userId: string) => {
  const res = await fetch(`${API_BASE}/orders/user/${userId}`);
  return res.json();
};

// Update order status
export const updateOrderStatus = async (id: string, status: string) => {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

// Auth
export const register = async (data: any) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data: any) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}; 