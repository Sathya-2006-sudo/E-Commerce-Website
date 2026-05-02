'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Truck, CheckCircle, Clock, Package, XCircle } from 'lucide-react';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
};

const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (error) {
        console.error('Failed to fetch order');
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 w-48 skeleton mb-8" />
        <div className="card p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-20 h-20 skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 skeleton" />
                  <div className="h-4 w-1/4 skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link href="/orders" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const currentStatusIndex = statusFlow.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 dark:text-gray-400">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className={`badge ${status.bg} ${status.color} px-4 py-2 text-sm font-medium`}>
          <status.icon className="w-4 h-4 mr-1.5 inline" />
          {status.label}
        </span>
      </div>

      {/* Order Progress */}
      {order.status !== 'cancelled' && (
        <div className="card p-6 mb-8">
          <h2 className="font-semibold mb-6">Order Progress</h2>
          <div className="flex items-center justify-between">
            {statusFlow.map((step, index) => {
              const StepIcon = statusConfig[step].icon;
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                  } ${isCurrent ? 'ring-4 ring-primary-200 dark:ring-primary-900' : ''}`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {statusConfig[step].label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-4 py-3 border-b border-gray-100 last:border-0 dark:border-gray-800">
              <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">🛍️</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">Rs.{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Shipping Address</h2>
          <div className="text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Payment Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Payment Method</span>
              <span className="font-medium text-gray-900 dark:text-white uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>Rs.{order.itemsPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span>Rs.{order.shippingPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax</span>
              <span>Rs.{order.taxPrice}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>Total</span>
              <span className="text-primary-600">Rs.{order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
