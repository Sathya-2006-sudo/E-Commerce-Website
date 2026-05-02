'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Star, ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="card group overflow-hidden">
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20">
            <span className="text-5xl">🛍️</span>
          </div>
        )}

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            <Link
              href={`/products/${product._id}`}
              className="flex-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-white transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (product.stock > 0) addToCart(product);
              }}
              disabled={product.stock === 0}
              className="flex-1 bg-primary-600 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">
          {product.category}
        </p>
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Rs.{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              Rs.{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= Math.round(product.rating || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-200 dark:text-gray-700'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({product.numReviews || 0})
          </span>
        </div>
      </div>
    </div>
  );
}
