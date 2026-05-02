'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Package, ChevronRight, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.data);
      } catch (error) {
        console.error('Failed to fetch orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6">
              <div className="flex justify-between mb-4">
                <div className="h-5 w-32 skeleton" />
                <div className="h-5 w-20 skeleton" />
              </div>
              <div className="h-4 w-24 skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No orders yet"
        description="You have not placed any orders yet. Start shopping to see your orders here."
        action={
          <Link href="/products" className="btn-primary flex items-center gap-2">
            Start Shopping
            <ChevronRight className="w-4 h-4" />
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => {
          const status = statusConfig[order.status];
          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="card p-6 hover:shadow-md transition-shadow block"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`badge ${status.bg} ${status.color}`}>
                      <status.icon className="w-3 h-3 mr-1" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">Rs.{order.totalPrice.toLocaleString()}</p>
                  <ChevronRight className="w-5 h-5 text-gray-400 inline-block mt-1" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 overflow-x-auto dark:border-gray-800">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">🛍️</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-32">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
