'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InventoryItem, InventoryStats } from '@/types';
import { formatKES } from '@/lib/utils';

// Define the API response type
interface ApiResponse {
  stats: InventoryStats;
  recentItems: InventoryItem[];
}

export default function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }
      
      const data: ApiResponse = await response.json();
      setStats(data.stats);
      setItems(data.recentItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button
              onClick={loadData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
          <button
            onClick={loadData}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Load Data
          </button>
        </div>
      </div>
    );
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
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
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

        {/* Category Breakdown */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Category Breakdown</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {Object.entries(stats.categoryStats).map(([category, categoryStats]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{category}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div>Items: {categoryStats.count}</div>
                      <div>Value: {formatKES(categoryStats.value)}</div>
                      <div>Profit: {formatKES(categoryStats.profit)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/inventory/add')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add New Item
            </button>
            <button
              onClick={() => router.push('/inventory/categories')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Manage Categories
            </button>
            <button
              onClick={() => router.push('/inventory')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              View All Items
            </button>
            <button
              onClick={loadData}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Recent Items */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Items</h3>
              <span className="text-sm text-gray-500">{items.length} items</span>
            </div>
            <div className="border-t border-gray-200">
              {items.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No items found. <button 
                    onClick={() => router.push('/inventory/add')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Add your first item
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.item_id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                            <div className="text-sm text-gray-500">
                              {item.item_category} • {item.item_subcategory || 'No subcategory'}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Condition: <span className="capitalize">{item.item_condition}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{formatKES(item.sale_price)}</div>
                            <div className="text-xs text-gray-500">Cost: {formatKES(item.purchase_price)}</div>
                          </div>
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}