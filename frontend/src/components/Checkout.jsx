import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your real Stripe public key
const stripePromise = loadStripe('pk_test_51MockKey1234567890abcdef');

const CheckoutForm = ({ address, city, zip, cartItems, cartTotal, paymentMethod }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (paymentMethod === 'credit_card' && (!stripe || !elements)) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      const token = localStorage.getItem('access_token');
      const productIds = cartItems.map(item => item.id);
      
      let paymentIntentId = "fake_charge_123";

      if (paymentMethod === 'credit_card') {
        // 1. Get client secret from backend
        const intentRes = await axios.post('http://localhost:8000/api/store/create-payment-intent/', 
          { amount: cartTotal },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const clientSecret = intentRes.data.clientSecret;

        // 2. Confirm payment
        const cardElement = elements.getElement(CardElement);
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              address: {
                city: city,
                postal_code: zip,
                line1: address,
              }
            }
          }
        });

        if (paymentResult.error) {
          throw new Error(paymentResult.error.message);
        }
        
        paymentIntentId = paymentResult.paymentIntent.id;
      }

      // 3. Finalize order on backend
      await axios.post('http://localhost:8000/api/store/checkout/', 
        { 
          product_ids: productIds,
          address: address,
          city: city,
          zip_code: zip,
          payment_method: paymentMethod,
          payment_intent_id: paymentIntentId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const methodText = paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      alert(`Success! Order placed via ${methodText}. Games are now in your library!`);
      if (clearCart) clearCart();
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Delivery Details</h3>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Street Address</label>
          <input required type="text" value={address} onChange={(e) => address.set(e.target.value)} className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500" placeholder="123 Gamer Street" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
            <input required type="text" value={city} onChange={(e) => city.set(e.target.value)} className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500" placeholder="New York" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">ZIP / Postal Code</label>
            <input required type="text" value={zip} onChange={(e) => zip.set(e.target.value)} className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500" placeholder="10001" />
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Payment Method</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'credit_card', label: 'Credit/Debit Card (Stripe)' },
            { id: 'upi', label: 'UPI (GPay, PhonePe)' },
            { id: 'cash_on_delivery', label: 'Cash on Delivery' },
          ].map((method) => (
            <label key={method.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod.value === method.id ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-transparent hover:border-gray-500'}`}>
              <input 
                type="radio" 
                name="payment" 
                value={method.id} 
                checked={paymentMethod.value === method.id}
                onChange={(e) => paymentMethod.set(e.target.value)}
                className="hidden" 
              />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod.value === method.id ? 'border-green-500' : 'border-gray-500'}`}>
                {paymentMethod.value === method.id && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
              </div>
              <span className="text-white font-medium">{method.label}</span>
            </label>
          ))}
        </div>

        {paymentMethod.value === 'credit_card' && (
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 mt-4">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#fff',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#fa755a', iconColor: '#fa755a' },
              }
            }} />
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
      )}

      {/* Order Summary */}
      <div className="pt-6 border-t border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-400 font-medium">Total Amount ({cartItems.length} items)</span>
          <span className="text-3xl font-black text-white">${cartTotal}</span>
        </div>
        <button 
          type="submit"
          disabled={isProcessing || (paymentMethod.value === 'credit_card' && !stripe)}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all text-lg flex justify-center items-center gap-2"
        >
          {isProcessing ? "Processing Secure Payment..." : `Confirm Order - $${cartTotal}`}
        </button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);

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
              Secure Checkout
            </h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                address={{value: address, set: setAddress}}
                city={{value: city, set: setCity}}
                zip={{value: zip, set: setZip}}
                paymentMethod={{value: paymentMethod, set: setPaymentMethod}}
                cartItems={cartItems}
                cartTotal={cartTotal}
              />
            </Elements>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
