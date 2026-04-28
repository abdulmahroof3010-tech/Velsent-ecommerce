import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ProductCard from "../reusableComponent/ProductCard";
import NavBar from "../components/layout/NavBar";

function Products() {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get("page")) || 1;
  const sort = params.get("sort") || "";
  const type = params.get("type") || "";
  const name = params.get("name") || "";

  const [search, setSearch] = useState(name);
  const [debouncedSearch, setDebouncedSearch] = useState(name);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const queryParams = new URLSearchParams();
  if (page > 1) queryParams.set("page", page);
  if (sort) queryParams.set("sort", sort);
  if (type) queryParams.set("type", type);
  if (debouncedSearch) queryParams.set("name", debouncedSearch);
  queryParams.set("limit", 10);

  const query = `products?${queryParams.toString()}`;

  const { datas, loading, totalPages } = useFetch(query);

  const updateParams = (newParams) => {
    const clean = {};
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "" && value !== 1) {
        clean[key] = value;
      }
    });
    setParams(clean, { replace: true });
  };

  useEffect(() => {
    updateParams({
      page: 1,
      sort,
      type,
      name: debouncedSearch,
    });
  }, [debouncedSearch]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    updateParams({
      page: newPage,
      sort,
      type,
      name: debouncedSearch,
    });
  };

  const handleSortChange = (value) => {
    updateParams({
      page: 1,
      sort: value,
      type,
      name: debouncedSearch,
    });
  };

  const handleTypeChange = (value) => {
    updateParams({
      page: 1,
      sort,
      type: value,
      name: debouncedSearch,
    });
  };

  return (
    <>
      <NavBar />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-10 sm:py-16">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl font-light tracking-wide text-gray-900">
            The Collection
          </h1>
          <div className="w-16 h-[1px] bg-gray-300 mx-auto mt-3 sm:mt-4"></div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm tracking-wide text-gray-400 uppercase">
            Timeless Fragrance, Refined Elegance
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 sm:mb-16">

          {/* Search */}
          <input
            type="text"
            placeholder="Search the collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[220px] md:w-[320px] px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 bg-white shadow-sm text-xs sm:text-sm placeholder-gray-400 focus:outline-none"
          />

          {/* Type */}
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 bg-white shadow-sm text-xs sm:text-sm"
          >
            <option value="">All Types</option>
            <option value="Fragrance">Fragrance</option>
            <option value="Sauvage">Sauvage</option>
            <option value="Dior Homme">Dior Homme</option>
            <option value="Higher">Higher</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 bg-white shadow-sm text-xs sm:text-sm"
          >
            <option value="">Sort</option>
            <option value="newest">Newest</option>
            <option value="bestseller">Best Seller</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>

          </select>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <p className="text-center py-20 text-gray-400">Loading...</p>
        ) : datas.length === 0 ? (
          <p className="text-center py-20 text-gray-400">No products found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {datas.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 sm:mt-20 flex justify-center items-center gap-6 sm:gap-10">

            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className={`text-xs sm:text-sm ${
                page <= 1 ? "text-gray-300" : "text-gray-600 hover:text-black"
              }`}
            >
              ← Previous
            </button>

            <span className="text-xs sm:text-sm text-gray-500">
              <span className="text-black font-medium">{page}</span> / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className={`text-xs sm:text-sm ${
                page >= totalPages ? "text-gray-300" : "text-gray-600 hover:text-black"
              }`}
            >
              Next →
            </button>

          </div>
        )}
      </div>
    </>
  );
}

export default Products;