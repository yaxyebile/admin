import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle, Clock } from 'lucide-react';
import * as api from '../../api';

const AdminOrders: React.FC = () => {
  const { fetchOrders } = useCart();
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const orders = await fetchOrders();
      setAllOrders(orders);
      setLoading(false);
    };
    loadOrders();
  }, []);

  // Toggle order status (pending <-> completed)
  const handleToggleStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await api.updateOrderStatus(orderId, newStatus);
    setAllOrders(prev => prev.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Cancel order handler (frontend only)
  const handleCancelOrder = async (orderId: string) => {
    await api.updateOrderStatus(orderId, 'canceled');
    setAllOrders(prev => prev.map(order =>
      order._id === orderId ? { ...order, status: 'canceled' } : order
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-primary flex items-center gap-2">
          All Orders (Admin)
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-primary text-lg font-semibold">Loading...</span>
          </div>
        ) : allOrders.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h9.04a2 2 0 001.83-1.3L21 13M7 13V6h13" /></svg>
            <div className="text-gray-500 text-lg">No orders found.</div>
          </div>
        ) : (
          <div className="space-y-8">
            {[...allOrders]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => (
              <div key={order._id} className="border border-gray-100 rounded-xl shadow p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Order ID:</span>
                    <span className="text-xs text-gray-500 font-mono">{order._id}</span>
                  </div>
                  {/* Status badge, clickable to toggle */}
                  <button
                    onClick={() => handleToggleStatus(order._id, order.status)}
                    className={`px-3 py-1 rounded-full text-xs font-bold focus:outline-none transition-colors flex items-center gap-1
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    title="Click to toggle status"
                  >
                    {order.status === 'pending' ? <Clock className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                    {order.status}
                  </button>
                </div>
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">User:</span>
                    <span className="text-gray-900">{order.userId?.username || order.userId?.email || order.userId}</span>
                  {order.name && (
                    <span className="ml-4 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Name: {order.name}</span>
                  )}
                  {order.phone && (
                    <span className="ml-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Phone: {order.phone}</span>
                  )}
                  {order.address && (
                    <span className="ml-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Address: {order.address}, {order.city}</span>
                  )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Total:</span>
                    <span className="text-lg font-bold text-primary">${order.total}</span>
                  </div>
                  <div className="text-sm text-gray-500">Created: {new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Products:</span>
                  <ul className="mt-2 space-y-2">
                    {order.products.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-3">
                        {item.product && item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded object-cover border" />
                        )}
                        <span className="font-medium text-gray-900">{item.product && (item.product.name || item.product)}</span>
                        <span className="text-xs text-gray-500">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleToggleStatus(order._id, order.status)}
                    className={`px-4 py-2 rounded-lg font-semibold text-xs focus:outline-none transition-colors flex items-center gap-1
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : order.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    title="Toggle Pending/Completed"
                  >
                    {order.status === 'pending' ? 'Mark as Completed' : order.status === 'completed' ? 'Mark as Pending' : 'Set Pending/Completed'}
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-xs hover:bg-red-700 transition-colors"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders; 