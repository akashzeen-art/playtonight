import React from 'react'
import { trackButtonClick } from '../utils/analytics'

const VideoBanner = () => {
  return (
    <div className="relative flex justify-center items-center rounded-xl overflow-hidden" style={{ background: 'rgba(10,10,20,0.6)' }}>
      <video 
        autoPlay 
        loop 
        playsInline 
        className="lg:rounded-xl w-full h-full object-cover"
        muted
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="md:hidden right-4 bottom-4 absolute">
        <button 
          style={{ background: 'linear-gradient(45deg, #ff6b35, #f7931e)', transition: 'all 0.2s ease' }}
          className="p-3 rounded-lg font-semibold text-white shadow-lg"
          onClick={() => {
            trackButtonClick('Order Now (Banner)')
            document.getElementById('shipping')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Order Now
        </button>
      </div>
    </div>
  )
}

export default VideoBanner

