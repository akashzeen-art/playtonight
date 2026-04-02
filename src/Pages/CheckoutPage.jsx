import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  generateClickid,
  getProductDetails,
  saveUserDataProduct,
  initiateCheckout,
} from '../wa-checkout/utils/productApi'
import { formatPrice } from '../wa-checkout/utils/priceFormatter'
import '../wa-checkout/components/Checkout.css'

const DEFAULT_PRODUCT_ID = '1001'
const DISCOUNT_PERCENT = 50

/**
 * Full-page static checkout: only the scroll-popup style card + PayU flow via local `/api` proxy.
 */
function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const productId = searchParams.get('id') || DEFAULT_PRODUCT_ID
  const clickidFromUrl = searchParams.get('clickid')

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Ron',
    phoneNumber: '',
    quantity: 1,
  })

  useEffect(() => {
    const currentClickid = searchParams.get('clickid')
    if (!currentClickid) {
      const newClickid = generateClickid(productId)
      const newParams = new URLSearchParams(searchParams)
      newParams.set('clickid', newClickid)
      window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`)
      setSearchParams(newParams)
    }
  }, [productId, searchParams, setSearchParams])

  useEffect(() => {
    if (!clickidFromUrl) return

    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const productData = await getProductDetails({ id: productId, clickid: clickidFromUrl })
        if (cancelled) return
        const priceRaw = productData?.price
        const priceNumber = Number(priceRaw)
        setProduct({
          price: Number.isFinite(priceNumber) ? priceNumber : 0,
          name:
            productData?.name ||
            productData?.productName ||
            productData?.product_name ||
            'Product',
          currency: productData?.currency || 'INR',
          checkouturl: productData?.checkouturl,
          successurl: productData?.successurl,
          failurl: productData?.failurl,
        })
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setProduct({
            price: 2099,
            name: 'Product',
            currency: 'INR',
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [productId, clickidFromUrl])

  const unitPrice = product?.price ?? 0
  const currency = product?.currency || 'INR'
  const totalPrice = unitPrice * formData.quantity
  const strikePrice = unitPrice * 2

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuantityChange = (change) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, prev.quantity + change)),
    }))
  }

  const handleClose = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    const cid = searchParams.get('clickid')
    if (!productId || !cid) {
      alert('Missing required parameters. Please refresh the page.')
      return
    }
    if (!product || !Number.isFinite(product.price)) {
      alert('Product details not loaded yet. Please wait and try again.')
      return
    }

    const numericProductId = Number(productId)
    if (!Number.isFinite(numericProductId)) {
      alert('Invalid product ID')
      return
    }

    try {
      setIsSubmitting(true)
      await saveUserDataProduct({
        msisdn: formData.phoneNumber,
        productId: numericProductId,
        clickId: cid,
        productName: product.name,
      })

      const payload = {
        firstName: formData.name.split(' ')[0] || formData.name,
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        email: '',
        phone: formData.phoneNumber,
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        amount: totalPrice.toFixed(2),
        currency,
        qty: formData.quantity,
        shippingMethod: 'free',
        clickid: cid,
        productInfo: null,
      }

      const data = await initiateCheckout({
        productId: numericProductId,
        payload,
        checkoutUrl: product.checkouturl,
      })

      navigate('/checkout/payu-redirect', {
        state: {
          actionUrl: 'https://secure.payu.in/_payment',
          params: data,
          successurl: data.successurl,
          failurl: data.failurl,
        },
      })
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="static-checkout-page">
      <div className="popup-checkout-modal static-checkout-card">
        <button
          className="popup-close-btn-outer"
          onClick={handleClose}
          aria-label="Close popup"
          type="button"
        >
          ×
        </button>
        <div className="popup-modal-header">
          <h2 id="scroll-popup-checkout-title" className="popup-modal-title">
            Complete Your Order
          </h2>
        </div>
        <div className="popup-modal-body">
          <div className="popup-payment-card" style={{ textAlign: 'center' }}>
            <p className="popup-payment-text">
              <span style={{ fontSize: '12px' }}>
                Proceed further to complete the payment of{' '}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: 'rgb(153, 153, 153)',
                    marginRight: '8px',
                  }}
                >
                  {loading ? '...' : formatPrice(strikePrice, currency)}
                </span>
                <span style={{ color: 'rgb(231, 76, 60)', fontWeight: 'bold' }}>
                  {loading
                    ? '...'
                    : `${formatPrice(totalPrice, currency)} (${DISCOUNT_PERCENT}% OFF)`}
                </span>
              </span>
            </p>
          </div>
          <form className="popup-checkout-form" onSubmit={handleSubmit}>
            <div className="popup-form-group">
              <label htmlFor="scroll-popup-name">Your Name</label>
              <input
                type="text"
                id="scroll-popup-name"
                name="name"
                className="popup-form-input"
                placeholder="Enter your full name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="popup-form-group">
              <label htmlFor="scroll-popup-phone">Mobile Number</label>
              <input
                type="tel"
                id="scroll-popup-phone"
                name="phoneNumber"
                className="popup-form-input"
                placeholder="Enter You WhatsApp Number"
                required
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="popup-form-group">
              <label htmlFor="scroll-popup-quantity">Quantity</label>
              <div className="popup-quantity-wrapper">
                <button
                  type="button"
                  className="popup-qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={formData.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  id="scroll-popup-quantity"
                  name="quantity"
                  className="popup-qty-input"
                  readOnly
                  min="1"
                  value={formData.quantity}
                />
                <button
                  type="button"
                  className="popup-qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={formData.quantity >= 10}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="popup-submit-btn"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Processing...' : 'Complete Order'}
            </button>
            <div className="whatsapp-message-info">
              On successful purchase, you will get a WhatsApp message on your registered mobile
              number. Reply with your complete shipping address.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
