import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not admin, redirect away
    if (!user || !user.is_superuser && !user.is_staff) {
        navigate('/');
        return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/api/admin-orders/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch admin orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white font-bold text-2xl">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-2">
              Admin Operations Dashboard
            </h2>
            <p className="text-gray-400 mb-8">View all global orders and physical delivery requests.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-900 border-b border-gray-700 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Delivery Address</th>
                    <th className="px-6 py-4 rounded-tr-lg">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-green-400">{order.id.split('-')[0]}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{order.username}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </td>
                      <td className="px-6 py-4 font-bold">${order.total_amount}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-900 px-3 py-1 rounded-full text-xs border border-gray-600">
                          {order.payment_method ? order.payment_method.replace(/_/g, ' ') : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.address ? (
                          <div className="text-sm">
                            <p className="text-white">{order.address}</p>
                            <p className="text-gray-400 text-xs">{order.city}, {order.zip_code}</p>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">Digital Delivery</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
