import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import { api } from "../../Service/Axios";
import { toast } from "react-toastify";

function AdminProducts() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced search state
  const [sortBy, setSortBy] = useState("name");
  const [isActive, setIsActive] = useState("all");
  const [categories, setCategories] = useState([]);

  // UI states
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [typing, setTyping] = useState(false);

  // Debounce effect for search
  useEffect(() => {
    setTyping(true);

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, debouncedSearch, isActive]);

  // Fetch products from backend with filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();

      // Only add type filter if not 'all'
      if (filter !== "all") {
        params.append("type", filter);
      }

      if (debouncedSearch) {
        params.append("name", debouncedSearch);
      }

      if (isActive !== "all") {
        params.append("isActive", isActive);
      }

      params.append("page", currentPage);
      params.append("limit", 10);

      const response = await api.get(`/admin/product?${params.toString()}`);

      if (response.data && response.data.Product) {
        setProductList(response.data.Product);
        setTotalCount(response.data.Count || 0);
      } else {
        setProductList([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.Message || "Error fetching products");
      setProductList([]);
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch, isActive, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/product/categories");

        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Toggle active status
  const toggleActive = async (product) => {
    try {
      setUpdatingStatus(product._id);

      await api.patch(`/admin/product/${product._id}/status`);

      // Refresh the product list to get updated data
      await fetchProducts();

      toast.success(
        `Product ${!product.isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error(
        error.response?.data?.Error || "Error updating product status",
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilter("all");
    setSearch("");
    setDebouncedSearch("");
    setSortBy("name");
    setIsActive("all");
    setCurrentPage(1);
  };

  // Loading state
  if (loading && productList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <Link
          to="/admin/products/add"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add New Product
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by name..."
              className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {typing && (
              <p className="text-xs text-gray-400 mt-1">Searching...</p>
            )}
          </div>

          <select
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value="all">All Status (Active & Inactive)</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          <select
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name A-Z</option>
            <option value="type">Category</option>
            <option value="price_high">Price: High to Low</option>
            <option value="price_low">Price: Low to High</option>
          </select>

          <button
            onClick={resetFilters}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      {productList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters or add a new product
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Stock
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...productList]
                    .sort((a, b) => {
                      // Frontend sorting for price since backend doesn't have it
                      switch (sortBy) {
                        case "price_high":
                          return (b.salePrice || 0) - (a.salePrice || 0);
                        case "price_low":
                          return (a.salePrice || 0) - (b.salePrice || 0);
                        case "name":
                          return (a.name || "").localeCompare(b.name || "");
                        case "type":
                          return (a.type || "").localeCompare(b.type || "");
                        default:
                          return 0;
                      }
                    })
                    .map((product) => (
                      <tr
                        key={product._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                product.image_url?.[0]?.url ||
                                product.image_url ||
                                "https://via.placeholder.com/150"
                              }
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/150")
                              }
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">
                                {product.ml}ml
                              </div>
                              {product.discount_percentage > 0 && (
                                <div className="text-xs text-green-600">
                                  {product.discount_percentage}% OFF
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {product.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              ₹
                              {product.salePrice ||
                                product.sale_price ||
                                product.original_price}
                            </div>
                            {product.discount_percentage > 0 && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹{product.original_price}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{product.stock}</span>
                            <span
                              className={`text-xs ${
                                product.stock === 0
                                  ? "text-red-600"
                                  : product.stock < 5
                                    ? "text-orange-600"
                                    : "text-green-600"
                              }`}
                            >
                              {product.stock === 0
                                ? "Out of Stock"
                                : product.stock < 5
                                  ? "Low Stock"
                                  : "In Stock"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {/* STATUS (only display) */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="text-gray-600 hover:text-black transition-colors inline-flex items-center gap-1"
                              title="Edit product"
                            >
                              <PencilIcon className="w-4 h-4" />
                              <span className="text-sm">Edit</span>
                            </Link>

                            <button
                              onClick={() => toggleActive(product)}
                              disabled={updatingStatus === product._id}
                              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                                product.isActive
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : "bg-green-100 text-green-600 hover:bg-green-200"
                              } ${updatingStatus === product._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              {product.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalCount > 10 && (
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {productList.length} of {totalCount} products
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {Math.ceil(totalCount / 10)}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / 10)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminProducts;
