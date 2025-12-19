import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import useFetch from '../../hooks/useFetch';
import { api } from '../../Service/Axios';
import { toast } from 'react-toastify';

function Products() {
  const fetchedProducts = useFetch('products');
  const [productList, setProductList] = useState([]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [deletingId, setDeletingId] = useState(null);

  // sync API data
  useEffect(() => {
    setProductList(fetchedProducts);
  }, [fetchedProducts]);

  // filter
  const filteredProducts = productList.filter(product => {
    if (filter !== 'all' && product.type !== filter) return false;
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'price_high': return b.sale_price - a.sale_price;
      case 'price_low': return a.sale_price - b.sale_price;
      case 'type': return a.type.localeCompare(b.type);
      default: return 0;
    }
  });

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      setProductList(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch {
      toast.error('Error deleting product');
    } finally {
      setDeletingId(null);
    }
  };

  // toggle active
  const toggleActive = async (product) => {
    try {
      const newStatus = !product.isActive;

      await api.patch(`/products/${product.id}`, {
        ...product,
        isActive: newStatus
      });

      setProductList(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, isActive: newStatus } : p
        )
      );

      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch {
      toast.error('Error updating product status');
    }
  };

  const categories = [...new Set(productList.map(p => p.type))];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <Link to="/admin/products/add" className="bg-black text-white px-6 py-3 rounded-lg">
          Add New Product
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Search by name..."
          className="border px-4 py-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="border px-4 py-2 rounded-lg" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select className="border px-4 py-2 rounded-lg" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Name A-Z</option>
          <option value="type">Category</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
        </select>

        <button
          onClick={() => { setFilter('all'); setSearch(''); setSortBy('name'); }}
          className="border px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <tbody>
            {sortedProducts.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.ml}ml</div>
                    </div>
                  </div>
                </td>

                <td className="p-4">{product.type}</td>
                <td className="p-4">₹{product.sale_price}</td>

                <td className="p-4">
                  <button
                    onClick={() => toggleActive(product)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>

                <td className="p-4 flex gap-2">
                  <Link to={`/admin/products/edit/${product.id}`}>
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Showing {sortedProducts.length} of {productList.length} products
      </p>
    </div>
  );
}

export default Products;
