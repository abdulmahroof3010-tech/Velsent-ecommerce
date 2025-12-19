import React, { useEffect, useState } from 'react'
import banr1 from "./../assets/banr1.webp"
import banr3 from "./../assets/banr3.webp"
import banr2 from "./../assets/banr2.webp"
import banr4 from "./../assets/banr4.webp"

function Banner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const bannerImages = [banr2, banr3, banr1, banr4];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % bannerImages.length);
        }, 2000);
        return () => clearInterval(interval)
    }, [bannerImages.length])

    return (
        <div className="relative mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 md:px-8">
            <div className="relative w-full h-[200px] sm:h-[260px] md:h-[450px] lg:h-[600px]">
                {bannerImages.map((item, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : ''
                        }`}
                    >
                        <img 
                            src={item} 
                            alt={`Banner ${index + 1}`} 
                            width="1920"
                             height="600"
                            loading={index === 0 ? "eager" : "lazy"}
                             fetchpriority={index === 0 ? "high" : "auto"}
                            className="w-full h-full object-cover rounded-[10px] sm:rounded-[12px] md:rounded-[14px] lg:rounded-[16px] p-[5px] sm:p-[6px] md:p-[7px] lg:p-[8px] shadow-[0px_6px_32px_rgba(245,222,179,0.75)]" 
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Banner