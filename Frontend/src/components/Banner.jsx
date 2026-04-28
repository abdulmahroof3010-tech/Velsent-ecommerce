import React, { useEffect, useState } from 'react'
import {api} from  "../Service/Axios"


function Banner() {
    const [bannerImages,setBannerImages]=useState([])
    const [currentSlide, setCurrentSlide] = useState(0);
   
    useEffect(()=>{
        const fetchBanners=async()=>{
            try{
                const res=await api.get("/banner");
                setBannerImages(res.data);
            }catch(e){
                console.error(e)
            }
        }
        fetchBanners()
    },[]);

    useEffect(() => {
        if(bannerImages.length ===0) return ;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % bannerImages.length);
        }, 2000);
        return () => clearInterval(interval)
    }, [bannerImages])

    return (
        <div className="relative mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 md:px-8">
            <div className="relative w-full h-[200px] sm:h-[260px] md:h-[450px] lg:h-[600px] overflow-hidden">

                {bannerImages.length === 0 ? (
    <div className="flex items-center justify-center h-full">
        <p>No banners available</p>
    </div>
) :(
                bannerImages.map((item, index) => (
                    <div 
                        key={item._id}
                        className={`absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : ''
                        }`}
                    >
                        <div className="w-full h-full p-[5px] sm:p-[6px] md:p-[7px] lg:p-[8px]">
    <img
      src={item.image.url}
      alt={`Banner ${index + 1}`}
      className="w-full h-full object-cover rounded-[10px] sm:rounded-[12px] md:rounded-[14px] lg:rounded-[16px] shadow-[0px_6px_32px_rgba(245,222,179,0.75)]"
    />
  </div>

                    </div>
                ))
            )}
            </div>
        </div>
    )

}

export default Banner