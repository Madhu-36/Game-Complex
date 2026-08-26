import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Loader from './Loader';
import { useLocation, Link } from 'react-router-dom';

const Storefront = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    // Fetch products from Django API with search and category params
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    let url = 'http://localhost:8000/api/products/?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;

    axios.get(url)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setError("Could not load games. Is the server running?");
        setLoading(false);
      });
  }, [location.search]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex justify-center items-center bg-transparent">
        <div className="bg-red-900 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category_name || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const isFiltered = new URLSearchParams(location.search).has('search') || new URLSearchParams(location.search).has('category');

  return (
    <div className="min-h-screen bg-transparent p-8 font-sans relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tight">
            G-C
          </h1>
          {isFiltered && (
            <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Clear Filters
            </Link>
          )}
        </div>
        
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-2 flex items-center gap-3">
              <span className="w-8 h-1 bg-green-500 rounded-full inline-block"></span>
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {categoryProducts.slice(0, isFiltered ? 150 : 14).map(product => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {products.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-xl">
            No games found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Storefront;
