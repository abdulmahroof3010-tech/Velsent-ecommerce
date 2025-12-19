import React from 'react'
import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="bg-white">
      {/* About Page Header */}
      <div className="relative">
        <div className="h-80 w-full overflow-hidden bg-gradient-to-r from-gray-900 to-amber-900">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-light text-white mb-4">About VELSCENT</h1>
              <p className="text-lg text-gray-200">Where fragrance becomes art</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main About Section */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          
          {/* Left Side - Image */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src="\src\assets\ab.webp"
                alt="VELSCENT Perfume Making"
                className="w-full h-auto rounded-lg shadow-2xl object-cover"
              />
              
              </div>
            </div>
          

          {/* Right Side - About Content */}
          <div className="lg:w-1/2">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <h2 className="text-4xl font-light text-gray-900 mb-6">Our Story</h2>
              
              <div className="space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  VELSCENT was born from a passion for creating unforgettable olfactory experiences. 
                  Founded in 1998, our journey began in a small workshop where master perfumers 
                  dedicated themselves to the art of fragrance creation.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Our name, VELSCENT, combines "velvet" and "scent" - representing the luxurious, 
                  smooth experience our fragrances provide. Each bottle tells a story, each scent 
                  captures a moment in time.
                </p>

               

                <p className="text-lg leading-relaxed">
                  Today, VELSCENT stands as a testament to timeless elegance in perfumery. 
                  We continue to blend traditional craftsmanship with innovative techniques, 
                  sourcing the finest ingredients from around the world to create scents that 
                  stand the test of time.
                </p>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-leaf text-amber-900 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Natural Ingredients</h3>
                    <p className="text-sm text-gray-600">Sustainably sourced from ethical suppliers</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-hand-sparkles text-amber-900 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Handcrafted</h3>
                    <p className="text-sm text-gray-600">Each bottle carefully crafted by artisans</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-earth-americas text-amber-900 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Global Reach</h3>
                    <p className="text-sm text-gray-600">Available in over 50 countries</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <i className="fa-solid fa-award text-amber-900 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Award-Winning</h3>
                    <p className="text-sm text-gray-600">12 international fragrance awards</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-10">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-amber-900 transition duration-300"
                >
                  Explore Our Collections
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-light text-center text-gray-900 mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-heart text-amber-900 text-2xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Passion for Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every ingredient, every bottle, every detail matters.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-lightbulb text-amber-900 text-2xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                Pushing boundaries while respecting tradition. Creating scents for the modern era.
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-hand-holding-heart text-amber-900 text-2xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Sustainability</h3>
              <p className="text-gray-600">
                Committed to ethical sourcing and eco-friendly practices for a better future.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-gray-50 to-amber-50 p-12 rounded-xl">
          <h2 className="text-3xl font-light text-gray-900 mb-6">Experience VELSCENT</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Visit one of our flagship boutiques or explore our collections online. 
            Let us help you find your signature scent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-6 py-3 bg-amber-900 text-white rounded-md hover:bg-gray-900 transition duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About