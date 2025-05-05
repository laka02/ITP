import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    averagePrice: 0,
    totalValue: 0,
    categoryCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/stats/inventory');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInventoryStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 pt-8">
          <h3 className="text-3xl font-bold mb-2 text-blue-800">Welcome to the</h3>
          <h1 className="text-6xl font-bold text-blue-900 mb-6">Quick Cart Grocery Store</h1>
          <Link 
            to="/products" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300"
          >
            View Products
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Inventory Dashboard</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading inventory stats...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 font-medium">Error loading stats: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Total Products Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-gray-600 text-lg mb-2">Total Products</h3>
                <p className="text-4xl font-bold text-blue-600">{stats.totalProducts}</p>
              </div>
              
              {/* Total Stock Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-gray-600 text-lg mb-2">Total Stock</h3>
                <p className="text-4xl font-bold text-blue-600">{stats.totalStock}</p>
              </div>
              
              {/* Average Price Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-gray-600 text-lg mb-2">Avg. Price</h3>
                <p className="text-4xl font-bold text-blue-600">Rs. {stats.averagePrice.toFixed(2)}</p>
              </div>
              
              {/* Total Value Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-gray-600 text-lg mb-2">Total Value</h3>
                <p className="text-4xl font-bold text-blue-600">Rs. {stats.totalValue.toFixed(2)}</p>
              </div>
              
              {/* Categories Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-gray-600 text-lg mb-2">Categories</h3>
                <p className="text-4xl font-bold text-blue-600">{stats.categoryCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;