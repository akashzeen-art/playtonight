import { useMemo, useState } from 'react'
import { trackButtonClick } from '../utils/analytics'
import { saveUserDataProduct } from '../utils/productApi'
import { formatPrice, calculateOriginalPrice } from '../utils/priceFormatter'

const CartSection = ({
  product,
  loading,
  refreshing,
  error,
  onRetry,
  lastUpdatedAt,
  productId,
  clickid,
  navigate,
}) => {
  const [qty, setQty] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const updateQty = (type) => {
    trackButtonClick(type === 'inc' ? 'Quantity Increase (+)' : 'Quantity Decrease (-)')
    setQty((prev) => (type === 'inc' ? prev + 1 : Math.max(1, prev - 1)))
  }

  const unitPrice = useMemo(() => (product && Number.isFinite(product.price) ? product.price : 0), [product])
  const productName = useMemo(() => product?.name || 'Product', [product])
  const currency = useMemo(() => product?.currency || 'INR', [product])
  const discountPercent = useMemo(() => product?.discount || 50, [product])
  const originalPrice = useMemo(() => unitPrice ? calculateOriginalPrice(unitPrice, discountPercent) : 0, [unitPrice, discountPercent])
  const subtotal = unitPrice * qty
  const total = subtotal

  const handleSubmit = async (e) => {
    e.preventDefault()
    trackButtonClick('Place Order')
    
    // STRICT VALIDATION: Block checkout if any required condition fails
    if (isSubmitting) {
      return // Already processing
    }
    if (!productId || !clickid) {
      alert('Missing required URL params: id and clickid')
      return
    }
    if (!product || !Number.isFinite(product.price)) {
      alert('Product details not loaded yet. Please wait and try again.')
      return
    }
    if (!product.name) {
      alert('Product name missing from product API. Please retry.')
      return
    }

    // Validate terms checkbox
    const termsCheckbox = document.getElementById('terms')
    if (!termsCheckbox || !termsCheckbox.checked) {
      alert('Please accept the Terms & Conditions and Privacy Policy to continue.')
      return
    }

    const numericProductId = Number(productId)
    if (!Number.isFinite(numericProductId)) {
      alert('Invalid product id in URL')
      return
    }

    // Save user data (MSISDN + product metadata) before initiating payment
    try {
      setIsSubmitting(true)
      await saveUserDataProduct({
        msisdn: formData.phone,
        productId: numericProductId,
        clickId: clickid,
        productName: product.name,
      })
    } catch (err) {
      console.error('❌ saveuserdataproduct error:', err)
      // Don’t crash; allow user to retry.
      alert('Could not save your details. Please try again.')
      setIsSubmitting(false)
      return
    }

    // If the user hasn’t filled the full shipping form yet, stop after saving MSISDN.
    // This satisfies the lead-capture requirement without breaking when optional fields are empty.
    const hasFullShippingDetails =
      !!formData.email &&
      !!formData.firstName &&
      !!formData.address1 &&
      !!formData.city &&
      !!formData.zipcode &&
      !!formData.state &&
      !!formData.country

    if (!hasFullShippingDetails) {
      alert('Saved. Please complete the shipping details to place your order.')
      setIsSubmitting(false)
      return
    }

    const payload = {
      ...formData,
      amount: total.toFixed(2),
      currency: currency, // Use currency from API
      qty,
      shippingMethod: 'free',
      clickid,
      productInfo: null, // Explicitly set as per backend expectation
    }

    console.log('📤 Sending payload to backend:', { ...payload, clickid })

    try {
      // Dynamic checkout URL: backend controls product ID
      const res = await fetch(
        `https://playtonight.fun/api/payment/checkout/${numericProductId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'omit',
        }
      )

      if (!res.ok) {
        throw new Error('Payment API failed')
      }

      const data = await res.json()
      console.log('✅ Checkout success:', data)

      // Backend controls redirect URLs (successurl/failurl)
      // If backend provides them, use them; otherwise default to PayU redirect page
      if (data.successurl || data.failurl) {
        // Store redirect URLs for PayURedirect component to handle
        navigate('/payu-redirect', {
          state: {
            actionUrl: 'https://secure.payu.in/_payment',
            params: data,
            successurl: data.successurl,
            failurl: data.failurl,
          },
        })
      } else {
        // Default PayU redirect flow
        navigate('/payu-redirect', {
          state: {
            actionUrl: 'https://secure.payu.in/_payment',
            params: data,
          },
        })
      }
    } catch (error) {
      console.error('❌ Checkout error:', error)
      alert('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="lg:col-span-2 p-6 rounded-2xl" style={{ background: 'rgba(10,10,20,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,107,53,0.25)' }}>
        <h2 className="mb-2 font-semibold text-xl text-white">Shipping Address</h2>

        {/* Product price loader/error state */}
        <div className="mb-3">
          {loading && !product ? (
            <div className="text-sm" style={{ color: '#b0b0b0' }}>Loading latest price…</div>
          ) : null}
          {!!product && (
            <div className="mt-2 text-sm" style={{ color: '#b0b0b0' }}>
              <span className="font-medium text-white">{productName}</span> —{' '}
              <span className="line-through mr-1" style={{ color: '#555' }}>{formatPrice(originalPrice, currency)}</span>
              <span className="font-semibold" style={{ color: '#ff6b35' }}>{formatPrice(unitPrice, currency)} ({discountPercent}% OFF)</span>
              {refreshing ? <span style={{ color: '#666' }}> (updating…)</span> : null}
            </div>
          )}
        </div>

        <form className="space-y-2" id="checkoutForm" onSubmit={handleSubmit}>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="px-3 py-3 rounded-lg w-full text-white"
              style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
              placeholder="Phone Number*"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-3 py-3 rounded-lg w-full text-white"
              style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
              placeholder="Email*"
            />
          </div>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="px-3 py-3 rounded-lg w-full text-white"
            style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
            placeholder="Full Name*"
          />
          <div className="gap-2 grid grid-cols-1">
            <input
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className="px-3 py-3 rounded-lg w-full text-white"
              style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
              placeholder="House number and street name"
            />
            <input
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="px-3 py-3 rounded-lg w-full text-white"
              style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
              placeholder="Apartment, suite, unit, etc. (optional)"
            />
          </div>
          <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="px-3 py-3 rounded-lg w-full text-white"
              style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
              placeholder="City name*"
            />
            <input
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="px-3 py-3 rounded-lg w-full text-white"
              style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
              placeholder="Postcode*"
            />
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="px-3 py-3 rounded-lg w-full text-white"
              style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
              placeholder="State*"
            />
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="px-3 py-3 rounded-lg w-full text-white"
              style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', outline: 'none', transition: 'border-color 0.2s ease' }}
              placeholder="Country*"
            />
          </div>
        </form>
      </div>

      <div className="p-6 rounded-2xl h-fit" style={{ background: 'rgba(10,10,20,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,107,53,0.25)' }}>
        <h2 className="mb-4 font-semibold text-xl text-white">Your Cart</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img src="/Capsules.png" alt="item" className="rounded-lg w-16 h-16 object-cover" />
            <div className="flex-1">
              <p className="font-medium text-white">{productName}</p>
              <div className="text-xs mt-1">
                <span className="line-through mr-1" style={{ color: '#555' }}>{formatPrice(originalPrice, currency)}</span>
                <span className="font-semibold" style={{ color: '#ff6b35' }}>{formatPrice(unitPrice, currency)} ({discountPercent}% OFF)</span>
              </div>
              <div className="flex items-center mt-1">
                <button
                  className="px-2 py-1 rounded-l text-white"
                  style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', transition: 'background 0.15s ease' }}
                  type="button"
                  onClick={() => updateQty('dec')}
                >
                  -
                </button>
                <span className="px-3 text-white" style={{ borderTop: '1px solid rgba(85,85,85,0.5)', borderBottom: '1px solid rgba(85,85,85,0.5)' }}>{qty}</span>
                <button
                  className="px-2 py-1 rounded-r text-white"
                  style={{ background: 'rgba(74,74,74,0.6)', border: '1px solid rgba(85,85,85,0.5)', transition: 'background 0.15s ease' }}
                  type="button"
                  onClick={() => updateQty('inc')}
                >
                  +
                </button>
              </div>
            </div>
            <p className="font-semibold text-white">{formatPrice(unitPrice * qty, currency)}</p>
          </div>
        </div>

        <div className="space-y-2 mt-4 text-sm">
          <div className="flex justify-between pt-2 font-semibold text-lg text-white" style={{ borderTop: '1px solid rgba(85,85,85,0.4)' }}>
            <span>Total</span>
            <span>{formatPrice(total, currency)}</span>
          </div>
        </div>

        <div className="flex items-start space-x-3 mt-4">
          <input
            id="terms"
            type="checkbox"
            defaultChecked
            required
            className="rounded w-5 h-5 mt-0.5"
            style={{ accentColor: '#ff6b35' }}
          />
          <label htmlFor="terms" className="text-sm" style={{ color: '#b0b0b0' }}>
            I have read and agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b35' }} className="hover:underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacypolicy" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b35' }} className="hover:underline">
              Privacy Policy
            </a>.
          </label>
        </div>

        <button
          form="checkoutForm"
          disabled={isSubmitting || loading}
          className="mt-4 py-3 rounded-lg w-full font-semibold text-white"
          style={{ background: 'linear-gradient(45deg, #ff6b35, #f7931e)', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(255,107,53,0.3)', opacity: (isSubmitting || loading) ? 0.6 : 1 }}
        >
          {isSubmitting ? 'Processing…' : 'Place Order'}
        </button>
      </div>
    </>
  )
}

export default CartSection

