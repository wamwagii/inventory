'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InventoryItem, InventoryStats } from '@/types';
import { formatKES } from '@/lib/utils';
import { getItems, getCategories } from '@/lib/data';

export default function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadData();
  }, [router]);

  const loadData = () => {
    const itemsData = getItems();
    const categories = getCategories();
    
    setItems(itemsData);

    // Calculate stats
    const totalItems = itemsData.reduce((sum, item) => sum + item.quantity_in_stock, 0);
    const totalValue = itemsData.reduce((sum, item) => sum + (item.sale_price * item.quantity_in_stock), 0);
    const totalProfit = itemsData.reduce((sum, item) => sum + (item.profit_margin * item.quantity_in_stock), 0);

    const categoryStats = itemsData.reduce((acc, item) => {
      if (!acc[item.item_category]) {
        acc[item.item_category] = { count: 0, value: 0, profit: 0 };
      }
      acc[item.item_category].count += item.quantity_in_stock;
      acc[item.item_category].value += item.sale_price * item.quantity_in_stock;
      acc[item.item_category].profit += item.profit_margin * item.quantity_in_stock;
      return acc;
    }, {} as any);

    setStats({
      totalItems,
      totalValue,
      totalProfit,
      categoryStats
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    router.push('/login');
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Inventory Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Items in Stock</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalItems}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Inventory Value</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatKES(stats.totalValue)}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Profit Potential</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatKES(stats.totalProfit)}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{Object.keys(stats.categoryStats).length}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/inventory/add')}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Add New Item
            </button>
            <button
              onClick={() => router.push('/inventory/categories')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Manage Categories
            </button>
            <button
              onClick={() => router.push('/inventory')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              View All Items
            </button>
          </div>
        </div>

        {/* Recent Items */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {items.slice(0, 5).map((item) => (
                  <li key={item.item_id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                          <div className="text-sm text-gray-500">
                            {item.item_category} • {item.item_subcategory}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-900">{formatKES(item.sale_price)}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.quantity_in_stock > 10 ? 'bg-green-100 text-green-800' : 
                          item.quantity_in_stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.quantity_in_stock} in stock
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}