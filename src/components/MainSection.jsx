import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from './NavBar.jsx'

const products = [
  {
    id: 1,
    name: 'Fragrances',
    href: '#fragrance-section',
    imageSrc: "/Images/img1.jpg",
    imageAlt: "Fragrances  gris dior",
  },
  {
    id: 2,
    name: 'Sauvage',
    href: '#sauvage-section',
    imageSrc: "/Images/img2.webp",
    imageAlt: "Sauvage image",
  },
  {
    id: 3,
    name: 'Dior Homme',
    href: '#dior-section',
    imageSrc: '/Images/img3.jpg',
    imageAlt: "Dior Homme",
  },
  {
    id: 4,
    name: 'Higher',
    href: '#higher-section',
    imageSrc: '/Images/imgH.jpg',
    imageAlt: "Fahrenheit",
  },
]

export default function MainSection() {
  return (
    
    
    <div className="bg-white">
      <div className="px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-5xl font-light tracking-tight text-center text-gray-900">
          Men's Fragrances
        </h2>

     <div 
  className="
    mt-20 
    grid 
    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
    gap-10 lg:gap-[5px] 
    justify-items-center 
    max-w-[900px] 
    mx-auto
  "
>
  {products.map((product) => (
    <div key={product.id} className="group relative flex flex-col items-center">
      <a href={product.href}>
        <img
          src={product.imageSrc}
          alt={product.imageAlt}
          className="
            w-[160px] h-[160px] 
            rounded-md object-cover 
            group-hover:opacity-75
          "
        />
      </a>

      <h3 className="text-sm text-gray-700 mt-3 text-center">
        {product.name}
      </h3>
    </div>
  ))}
</div>


      </div>
 <div className='text-center '> 
                  <h3 className="text-4xl font-light tracking-tight text-center text-gray-900">La Collection Privée</h3>
                  <p className='mt-5'>Perfume and couture blend to create structured olfactory silhouettes, crafted from the finest ingredients.</p>

                </div>
    </div>

  )
  
}

