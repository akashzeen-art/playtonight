import React from 'react'
import { trackButtonClick } from '../utils/analytics'
import { formatPrice, calculateOriginalPrice } from '../utils/priceFormatter'

const ProductSection = ({ product, loading, refreshing, error, productId, clickid }) => {
  const name = product?.name
  const numericPrice = product?.price
  const currency = product?.currency || 'INR'
  const discountPercent = product?.discount || 50
  const originalPrice = numericPrice ? calculateOriginalPrice(numericPrice, discountPercent) : null

  // Debug logging
  console.log('📦 ProductSection - product:', product);
  console.log('💰 ProductSection - numericPrice:', numericPrice, 'currency:', currency, 'discount:', discountPercent);
  console.log('💵 ProductSection - originalPrice:', originalPrice);

  return (
    <div className="relative mx-auto p-5 rounded-xl max-w-6xl overflow-hidden" style={{ background: 'rgba(42,42,42,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,107,53,0.2)' }}>
      <h3 className="mb-4 font-extrabold text-xl md:text-2xl text-center" style={{ color: '#f7931e' }}>
        भारत में पहली बार विश्व प्रसिद्ध PlayTonight
      </h3>
      <h3 className="mb-4 font-extrabold text-xl md:text-2xl text-center" style={{ color: '#f7931e' }}>
         १०० गुना बेहतर और बिकुल सुरक्षित हर्बल औषधि
      </h3>

      {/* Price Display */}
      {loading && !numericPrice ? (
        <div className="text-center mb-4">
          <span className="text-2xl md:text-4xl font-bold" style={{ color: '#b0b0b0' }}>Loading price...</span>
        </div>
      ) : numericPrice ? (
        <div className="text-center mb-4">
          <span className="text-xl font-bold">
            <span className="line-through mr-2" style={{ color: '#666' }}>{formatPrice(originalPrice, currency)}</span>
            <span className="font-bold animate-pulse" style={{ color: '#ff6b35' }}>{formatPrice(numericPrice, currency)} ({discountPercent}% OFF)</span>
          </span>
        </div>
      ) : null}

      <div className="items-center gap-8 grid grid-cols-1 md:grid-cols-2">
        <div className="flex justify-center">
          <img
            src="/Capsules.png"
            alt="PlayTonight Box"
            className="w-40 md:w-52 object-contain"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,107,53,0.3))' }}
          />
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-bold leading-relaxed" style={{ color: '#f7931e' }}>
            Baat hai asli मर्दानगी aur performance ki
          </h4>
          <h4 className="font-bold text-base md:text-lg leading-relaxed" style={{ color: '#f7931e' }}>
            10 lakh+ मर्दों ka trusted formula.
          </h4>
          <br />
          <h4 className="font-bold text-base md:text-lg leading-relaxed" style={{ color: '#f7931e' }}>
            PlayTonight ke saath har raat banegi aur bhi zyada DHAMAKEDAAR
          </h4>
        </div>
      </div>

      <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2 mt-6 text-center">
        <div className="p-3 rounded-lg" style={{ background: 'rgba(74,74,74,0.25)', border: '1px solid rgba(255,107,53,0.15)', transition: 'background 0.2s ease' }}>
          <h5 className="font-bold text-base md:text-lg" style={{ color: '#f7931e' }}>Aasli Taqat</h5>
          <p className="text-sm mt-1" style={{ color: '#b0b0b0' }}>Stamina aur energy ko naturally badhata hai</p>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'rgba(74,74,74,0.25)', border: '1px solid rgba(255,107,53,0.15)', transition: 'background 0.2s ease' }}>
          <h5 className="font-bold text-base md:text-lg" style={{ color: '#f7931e' }}>Mazboot Erection</h5>
          <p className="text-sm mt-1" style={{ color: '#b0b0b0' }}>Jab chahe tab mazboot aur tight</p>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'rgba(74,74,74,0.25)', border: '1px solid rgba(255,107,53,0.15)', transition: 'background 0.2s ease' }}>
          <h5 className="font-bold text-base md:text-lg" style={{ color: '#f7931e' }}>Lambi Performance</h5>
          <p className="text-sm mt-1" style={{ color: '#b0b0b0' }}>Zyada der tak tikne mein madad karta hai</p>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'rgba(74,74,74,0.25)', border: '1px solid rgba(255,107,53,0.15)', transition: 'background 0.2s ease' }}>
          <h5 className="font-bold text-base md:text-lg" style={{ color: '#f7931e' }}>Bharosa Badhaye</h5>
          <p className="text-sm mt-1" style={{ color: '#b0b0b0' }}>Apne aap par vishwas wapas laye</p>
        </div>
      </div>

      <div className="md:block flex flex-col justify-center items-center md:justify-between mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center w-full">
          <p className="font-extrabold text-lg md:text-2xl" style={{ color: '#e0e0e0' }}>2 Tablets Before Making Love <br />With Milk/Butter Milk(छाछ)</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center w-full">
          <p className="font-extrabold text-2xl md:text-4xl animate-pulse" style={{ color: '#ff6b35' }}>काम करें सिर्फ 45 मिनट में</p>
        </div>
        <button
          className="md:hidden mt-6 py-3 px-6 rounded-lg font-semibold text-white w-full max-w-xs"
          style={{ background: 'linear-gradient(45deg, #ff6b35, #f7931e)', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(255,107,53,0.4)' }}
          onClick={() => {
            trackButtonClick('Order Now')
            document.getElementById('shipping')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Order Now
        </button>
      </div>

      <img
        src="/7.png"
        alt="Doctor"
        className="hidden md:block bottom-0 left-1/2 absolute w-36 md:w-36 object-contain -translate-x-1/2"
      />
    </div>
  )
}

export default ProductSection

