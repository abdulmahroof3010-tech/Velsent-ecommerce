    import React, { useEffect, useState } from 'react'
  import useFetch from '../hooks/useFetch'
  import ProductCard from '../reusableComponent/ProductCard'

  function Fragrances({id}) {
    const datas = useFetch('products')?.filter(p=>p.isActive);

  const data = datas
    ?.filter((val) => val.type === "Fragrance")





  return (
    <div  id={id} className="bg-white py-16 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <h2 className="text-5xl mt-20 font-extralight tracking-wide text-center text-gray-900 mb-20">
          Fragrances
        </h2>

        <div className="grid grid-cols-1 gap-5   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">

          {data.map((product) => (
        <ProductCard key={product.id} product={product}/>
          ))}

        </div>
      </div>
    </div>
  )

  }

  export default Fragrances
