'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function CartPage() {
  const { cart, isLoaded, removeFromCart, updateQuantity, getTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const shipping = getTotal() > 500 ? 0 : 49;
  const tax = Math.round(getTotal() * 0.05 * 100) / 100;
  const total = getTotal() + shipping + tax;

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 flex gap-6">
              <div className="w-24 h-24 skeleton" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 skeleton" />
                <div className="h-4 w-1/4 skeleton" />
                <div className="h-8 w-32 skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        description="Looks like you have not added anything to your cart yet. Start shopping to fill it up!"
        action={
          <Link href="/products" className="btn-primary flex items-center gap-2">
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="card p-4 sm:p-6 animate-fade-in">
              <div className="flex gap-4 sm:gap-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl">🛍️</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 truncate block">
                    {item.name}
                  </Link>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    Rs.{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg dark:border-gray-700">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span>Rs.{getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `Rs.${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (5%)</span>
                <span>Rs.{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">Rs.{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-sm text-primary-600 bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg mb-4 dark:text-primary-400">
                Add Rs.{(500 - getTotal()).toLocaleString()} more for free shipping!
              </p>
            )}

            <button
              onClick={() => {
                if (!user) {
                  router.push('/login?redirect=checkout');
                } else {
                  router.push('/checkout');
                }
              }}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-lg"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link href="/products" className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
