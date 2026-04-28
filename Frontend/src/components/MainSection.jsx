import React from "react";
import { useNavigate } from "react-router-dom";

const products = [
  { id: 1, name: "Fragrance", imageSrc: "/Images/img1.jpg" },
  { id: 2, name: "Sauvage", imageSrc: "/Images/img2.webp" },
  { id: 3, name: "Dior Homme", imageSrc: "/Images/img3.jpg" },
  { id: 4, name: "Higher", imageSrc: "/Images/imgH.jpg" },
];

export default function MainSection() {
  const navigate = useNavigate();

  const handleNavigate = (type) => {
    navigate(`/products?type=${type}&page=1`,{ replace: true });
  };

  return (
    <div className="bg-white mt-16">
      <div className="px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-20">

        {/* Title */}
        <h2 className="text-5xl font-light tracking-tight text-center text-gray-900">
          Men's Fragrances
        </h2>

        {/* Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center max-w-[900px] mx-auto">
          
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleNavigate(product.name)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <img
                src={product.imageSrc}
                alt={product.name}
                className="w-[160px] h-[160px] rounded-md object-cover transition-all duration-300 group-hover:scale-105"
              />

              <h3 className="text-sm text-gray-700 mt-3 tracking-wide">
                {product.name}
              </h3>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-10">
        <h3 className="text-4xl font-light tracking-tight text-gray-900">
          La Collection Privée
        </h3>

        <p className="mt-5 text-gray-500 max-w-xl mx-auto">
          Perfume and couture blend to create structured olfactory silhouettes,
          crafted from the finest ingredients.
        </p>
      </div>
    </div>
  );
}