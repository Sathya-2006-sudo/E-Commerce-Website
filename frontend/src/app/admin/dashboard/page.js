'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Package, ShoppingCart, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/orders/stats'),
          api.get('/orders?limit=5'),
        ]);
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6">
              <div className="h-8 w-12 skeleton mb-3" />
              <div className="h-6 w-20 skeleton mb-2" />
              <div className="h-4 w-28 skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link href="/admin/products" className="btn-primary flex items-center gap-2">
          Manage Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalOrders || 0}</p>
          <p className="text-gray-500 text-sm mt-1">Total Orders</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">Rs.{stats?.totalRevenue?.toLocaleString() || 0}</p>
          <p className="text-gray-500 text-sm mt-1">Total Revenue</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.stats?.find(s => s._id === 'pending')?.count || 0}
          </p>
          <p className="text-gray-500 text-sm mt-1">Pending Orders</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.stats?.find(s => s._id === 'delivered')?.count || 0}
          </p>
          <p className="text-gray-500 text-sm mt-1">Delivered</p>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
            const stat = stats?.stats?.find(s => s._id === status);
            const colors = {
              pending: 'bg-yellow-500',
              processing: 'bg-blue-500',
              shipped: 'bg-purple-500',
              delivered: 'bg-green-500',
              cancelled: 'bg-red-500',
            };
            return (
              <div key={status} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className={`w-3 h-3 ${colors[status]} rounded-full mx-auto mb-2`} />
                <p className="text-2xl font-bold">{stat?.count || 0}</p>
                <p className="text-sm text-gray-500 capitalize">{status}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
                  <td className="py-3 px-4 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{order.user?.name || 'N/A'}</td>
                  <td className="py-3 px-4 font-medium">Rs.{order.totalPrice.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
