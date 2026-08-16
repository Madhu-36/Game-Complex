import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import Loader from './Loader';

const GameDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { cartItems, addToCart } = useContext(CartContext);
  
  const isInCart = product ? cartItems.some(item => item.id === product.id) : false;

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/?slug=${slug}`)
      .then(response => {
        if (response.data && response.data.length > 0) {
          setProduct(response.data[0]);
        } else {
          setError("Game not found.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching game details:", err);
        setError("Could not load game details.");
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (isAdded) return;
    setIsAdding(true);
    // Simulate network request for adding to cart
    setTimeout(() => {
      addToCart(product);
      setIsAdding(false);
      setIsAdded(true);
      // Reset button after 3 seconds
      setTimeout(() => setIsAdded(false), 3000);
    }, 800);
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen text-white flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded">
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen text-white font-sans pb-20"
    >
      {/* Top Banner Image with Gradient Overlay */}
      <div 
        className="h-[500px] w-full relative bg-cover bg-center" 
        style={{ backgroundImage: `url(${product.cover_image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-10">
          <Link to="/" className="text-gray-300 hover:text-white flex items-center bg-gray-900/50 px-4 py-2 rounded-lg backdrop-blur-sm transition-all hover:bg-gray-800">
            <span className="mr-2">&larr;</span> Back to Store
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Column: Big Image and Buy Button */}
          <div className="w-full md:w-1/3 flex flex-col">
            <motion.img 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              src={product.cover_image} 
              alt={product.title} 
              className="w-full rounded-2xl shadow-2xl border-4 border-gray-800"
            />
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 font-medium">Price</span>
                <span className="text-4xl font-black text-green-400">${product.price}</span>
              </div>
              
              {/* Animated Add To Cart Button */}
              <motion.button 
                whileHover={!isInCart && !isAdded ? { scale: 1.02 } : {}}
                whileTap={!isInCart && !isAdded ? { scale: 0.95 } : {}}
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex justify-center items-center h-16 ${
                  isInCart || isAdded 
                    ? 'bg-gray-700 text-green-400 border border-green-500/50 cursor-default opacity-80' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white hover:shadow-green-500/25'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                  ) : isInCart || isAdded ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      Already in Cart
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Add to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Title and Details */}
          <div className="w-full md:w-2/3 pt-4 md:pt-32">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-4 mb-3">
                <span className="bg-blue-600/20 text-blue-400 text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider border border-blue-500/20">
                  {product.category_name}
                </span>
                <span className="text-gray-400 text-sm font-medium bg-gray-800 px-4 py-1 rounded-full">
                  Released: {new Date(product.release_date).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tight text-white drop-shadow-lg">
                {product.title}
              </h1>
              
              <div className="bg-gray-800/80 rounded-2xl p-8 border border-gray-700/50 mb-8 backdrop-blur-md shadow-xl">
                <h3 className="text-2xl font-bold mb-4 text-gray-100 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  About this game
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Developer</span>
                <span className="text-white">{product.developer_name}</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Status</span>
                <span className="text-green-400 flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
                  Available Now
                </span>
              </div>
            </div>

            {/* Authentic Video Trailer (External Link Fix) */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Official Trailer</h3>
              
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(product.title + ' official gameplay trailer')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-video w-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 hover:border-green-500 transition-all cursor-pointer"
              >
                {/* Background Image */}
                <img 
                  src={product.cover_image} 
                  alt={`${product.title} Trailer`} 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-300"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                {/* Play Button Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="bg-red-600/90 group-hover:bg-red-500 text-white rounded-full p-4 md:p-6 shadow-lg shadow-red-900/50 transform group-hover:scale-110 transition-all duration-300 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-10 h-10 md:w-16 md:h-16 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="mt-4 text-white font-bold text-lg md:text-xl tracking-wide opacity-90 group-hover:opacity-100 drop-shadow-md">
                    Watch Trailer on YouTube
                  </span>
                </div>
              </a>
            </div>

            {/* Authentic Screenshots Gallery */}
            {product.screenshots && product.screenshots.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Screenshots</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.screenshots.map((imgUrl, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-gray-700 hover:border-green-500 transition-colors shadow-lg cursor-pointer">
                      <img src={imgUrl} alt={`${product.title} screenshot ${idx+1}`} className="w-full h-auto transform hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameDetails;
