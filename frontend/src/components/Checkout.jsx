import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsProcessing(true);
    try {
      const productIds = cartItems.map(item => item.id);
      const token = localStorage.getItem('access_token');
      // In a real app we would send the address and payment method to the backend
      await axios.post('http://localhost:8000/api/store/checkout/', 
        { 
          product_ids: productIds,
          address: address,
          city: city,
          zip_code: zip,
          payment_method: paymentMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const methodText = paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      alert(`Success! Order placed via ${methodText}. Games will be delivered to your address!`);
      if (clearCart) clearCart();
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <h2 className="text-3xl font-black text-white">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-green-400 hover:underline">Go back to store</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-8">
              Checkout Delivery
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Delivery Address</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Street Address</label>
                  <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500" placeholder="123 Gamer Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                    <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">ZIP / Postal Code</label>
                    <input required type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500" placeholder="10001" />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Payment Method</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'upi', label: 'UPI (GPay, PhonePe)' },
                    { id: 'net_banking', label: 'Net Banking' },
                    { id: 'cash_on_delivery', label: 'Cash on Delivery' },
                    { id: 'upi_doorstep', label: 'UPI on Doorstep' }
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method.id} 
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden" 
                      />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === method.id ? 'border-green-500' : 'border-gray-500'}`}>
                        {paymentMethod === method.id && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                      </div>
                      <span className="text-white font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="pt-6 border-t border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-medium">Total Amount ({cartItems.length} items)</span>
                  <span className="text-3xl font-black text-white">${cartTotal}</span>
                </div>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all text-lg flex justify-center items-center gap-2"
                >
                  {isProcessing ? "Processing Order..." : `Confirm Order - $${cartTotal}`}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
