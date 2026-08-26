import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="group block">
      <Link to={`/game/${product.slug}`} className="block h-full">
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 h-full flex flex-col transition-colors group-hover:border-green-500/50">
          <div className="relative aspect-video overflow-hidden bg-gray-900">
            {product.cover_image ? (
              <img 
                src={product.cover_image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-700">
                <span className="text-gray-500 font-bold">{product.title}</span>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
            
            {/* Price tag */}
            <div className="absolute bottom-3 left-3 bg-green-500 text-gray-900 font-black px-3 py-1 rounded shadow-lg text-sm transform transition-transform group-hover:scale-110">
              ${product.price}
            </div>
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors line-clamp-1">
              {product.title}
            </h3>
            <p className="text-sm text-gray-400 mb-3 flex-grow line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {product.category_name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
