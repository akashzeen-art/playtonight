import React, { useState, useEffect } from 'react'

const Navbar = () => {
  const [timeLeft, setTimeLeft] = useState(48 * 60) // 48 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 48 * 60 // Reset to 48 minutes
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <nav style={{ background: '#191938' }} className="shadow-lg">
      <div className="flex justify-center items-center mx-auto px-4 py-4 max-w-6xl">
        <h1 className="text-center font-extrabold text-3xl lg:text-6xl drop-shadow-lg">
          <span className="text-white tracking-wide">PlayTonight</span>
          <br />
          <span className="animate-pulse text-4xl lg:text-6xl font-extrabold" style={{ background: 'linear-gradient(45deg, #ff6b35, #f7931e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Festival Sale !!</span>
        </h1>
      </div>

      {/* Scrolling Ticker Strip */}
      <div style={{ background: '#000047' }} className="py-2 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span style={{ color: '#f7931e' }} className="font-bold text-lg mx-8">
            🔥 Order Now - Limited Time Offer - 50% OFF - Hurry Up! ⏰ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} Left
          </span>
          <span style={{ color: '#f7931e' }} className="font-bold text-lg mx-8">
            🔥 Order Now - Limited Time Offer - 50% OFF - Hurry Up! ⏰ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} Left
          </span>
          <span style={{ color: '#f7931e' }} className="font-bold text-lg mx-8">
            🔥 Order Now - Limited Time Offer - 50% OFF - Hurry Up! ⏰ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} Left
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

