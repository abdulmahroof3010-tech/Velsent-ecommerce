import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ProductCard from "../reusableComponent/ProductCard";

function NewArrivals() {
  const navigate = useNavigate();
  const { datas, loading } = useFetch("products?sort=newest&limit=6");
  const scrollRef = useRef(null);
  if (loading) return null;

  const loopData = [...datas, ...datas];

  return (
    <div className="mt-24 px-4 sm:px-6 overflow-hidden">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-center mb-8 sm:mb-12">
        New Arrivals
      </h2>

      {/* Scroll Track */}
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll cursor-grab active:cursor-grabbing"
            onMouseEnter={(e) =>
              (e.currentTarget.style.animationPlayState = "paused")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.animationPlayState = "running")
            }
            onMouseDown={(e) => {
              e.currentTarget.style.animationPlayState = "paused";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.animationPlayState = "running";
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.animationPlayState = "paused";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.animationPlayState = "running";
            }}
          >
            {loopData.map((product, index) => (
              <div
                key={index}
                className="min-w-[160px] sm:min-w-[190px] md:min-w-[220px] lg:min-w-[250px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View All */}
      <div className="flex justify-center mt-8 sm:mt-10">
        <button
          onClick={() => navigate("/products?sort=newest")}
          className="text-xs sm:text-sm tracking-widest uppercase text-gray-600 hover:text-black transition"
        >
          View All →
        </button>
      </div>
    </div>
  );
}

export default NewArrivals;