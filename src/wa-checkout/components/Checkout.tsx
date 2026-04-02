import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Checkout.css';
import { getProductDetails, saveUserDataProduct, initiateCheckout, generateClickid } from '../utils/productApi';
import { formatPrice, calculateOriginalPrice } from '../utils/priceFormatter';

// Global popup state context
const PopupStateContext = createContext<{
  hasManualPopupOpened: boolean;
  setHasManualPopupOpened: (value: boolean) => void;
  isManualPopupOpen: boolean;
  setIsManualPopupOpen: (value: boolean) => void;
  isAnyPopupVisible: boolean;
  setIsAnyPopupVisible: (value: boolean) => void;
}>({ 
  hasManualPopupOpened: false, 
  setHasManualPopupOpened: () => {}, 
  isManualPopupOpen: false, 
  setIsManualPopupOpen: () => {},
  isAnyPopupVisible: false,
  setIsAnyPopupVisible: () => {}
});

// Provider component
export const PopupStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasManualPopupOpened, setHasManualPopupOpened] = useState(false);
  const [isManualPopupOpen, setIsManualPopupOpen] = useState(false);
  const [isAnyPopupVisible, setIsAnyPopupVisible] = useState(false);
  return (
    <PopupStateContext.Provider value={{ 
      hasManualPopupOpened, 
      setHasManualPopupOpened, 
      isManualPopupOpen, 
      setIsManualPopupOpen,
      isAnyPopupVisible,
      setIsAnyPopupVisible
    }}>
      {children}
    </PopupStateContext.Provider>
  );
};

// Hook to use popup state
export const usePopupState = () => useContext(PopupStateContext);

// =====================================================
// CHECKOUT MODAL - Manual trigger modal
// =====================================================

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Default product ID (can be overridden via URL param ?id=)
const DEFAULT_PRODUCT_ID = '1001';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setIsAnyPopupVisible } = usePopupState();
  
  const productId = searchParams.get('id') || DEFAULT_PRODUCT_ID;
  const clickid = generateClickid(productId);

  const [product, setProduct] = useState<{ price: number; priceDisplay: string; name: string; currency?: string; description?: string; checkouturl?: string; successurl?: string; failurl?: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    quantity: 1
  });

  // Fetch product details
  useEffect(() => {
    if (!isOpen) return;
    
    setIsAnyPopupVisible(isOpen);
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetails({ id: productId, clickid });
        
        const priceRaw = productData?.price;
        const priceNumber = Number(priceRaw);
        
        if (Number.isFinite(priceNumber)) {
          setProduct({
            price: priceNumber,
            priceDisplay: typeof priceRaw === 'string' || typeof priceRaw === 'number' 
              ? String(priceRaw) 
              : String(priceNumber),
            name: productData?.name || productData?.productName || productData?.product_name || 'Product',
            currency: productData?.currency || 'INR',
            description: productData?.description,
            checkouturl: productData?.checkouturl,
            successurl: productData?.successurl,
            failurl: productData?.failurl
          });
        } else {
          console.error('Invalid price from API:', priceRaw);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        // Don't set fallback - let it remain null to show loading state
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId, clickid]);

  // Calculate total price based on quantity and dynamic price
  const unitPrice = product?.price || 0;
  const currency = product?.currency || 'INR';
  const discountPercent = 50; // Default discount
  const totalPrice = unitPrice * formData.quantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (change: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, prev.quantity + change))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!productId || !clickid) {
      alert('Missing required parameters. Please refresh the page.');
      return;
    }
    
    if (!product || !Number.isFinite(product.price)) {
      alert('Product details not loaded yet. Please wait and try again.');
      return;
    }

    const numericProductId = Number(productId);
    if (!Number.isFinite(numericProductId)) {
      alert('Invalid product ID');
      return;
    }

    try {
      setIsSubmitting(true);

      // Save user data first
      await saveUserDataProduct({
        msisdn: formData.phoneNumber,
        productId: numericProductId,
        clickId: clickid,
        productName: product.name,
      });

      // Prepare checkout payload
      const payload = {
        firstName: formData.name.split(' ')[0] || formData.name,
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        email: '', // Not required in WA PlayTonight UI
        phone: formData.phoneNumber,
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        amount: totalPrice.toFixed(2),
        currency: currency,
        qty: formData.quantity,
        shippingMethod: 'free',
        clickid,
        productInfo: null,
      };

      // Initiate checkout
      const data = await initiateCheckout({
        productId: numericProductId,
        payload,
      });

      // Navigate to PayU redirect page
      navigate('/checkout/payu-redirect', {
        state: {
          actionUrl: 'https://secure.payu.in/_payment',
          params: data,
          successurl: data.successurl,
          failurl: data.failurl,
        },
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button - Inside the modal */}
        <button className="modal-close-btn-outer" onClick={onClose} type="button">×</button>
        
        <div className="modal-header">
          <h2 className="modal-title">Complete Your Order</h2>
        </div>
        
        <div className="modal-logo-section">
          <div className="logo-circle">
            <div className="logo-content">
              <span className="logo-text">PlayTonight - Be Young Forever</span>
            </div>
          </div>
        </div>

        <div className="payment-info-box" style={{textAlign: 'center'}}>
          <p className="payment-text">
            <span style={{fontSize: '12px'}}>Proceed further to complete the payment of </span>
            <span className="highlight" style={{fontSize: '18px', fontWeight: 'bold'}}>
              <span style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>{loading ? '...' : formatPrice(unitPrice * 2, currency)}</span>
              <span style={{color: '#e74c3c', fontWeight: 'bold'}}>{loading ? '...' : formatPrice(totalPrice, currency)} ({discountPercent}% OFF)</span>
            </span>
          </p>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Mobile Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter You WhatsApp Number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <div className="quantity-selector">
              <button
                type="button"
                className="quantity-btn minus"
                onClick={() => handleQuantityChange(-1)}
                disabled={formData.quantity <= 1}
              >
                −
              </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                readOnly
                className="quantity-input"
                min="1"
              />
              <button
                type="button"
                className="quantity-btn plus"
                onClick={() => handleQuantityChange(1)}
                disabled={formData.quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="complete-order-btn"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? 'Processing...' : 'Complete Order'}
          </button>
          
          <div className="whatsapp-message-info">
            On successful purchase, you will get a WhatsApp message on your registered mobile number. Reply with your complete shipping address.
          </div>
        </form>
      </div>
    </div>
  );
};

// =====================================================
// CHECKOUT POPUP MODAL - Auto-appearing center-screen checkout popup
// =====================================================

/**
 * CheckoutPopupModal - Auto-appearing center-screen checkout popup
 * 
 * Features:
 * - Automatically appears every 20 seconds
 * - Center-positioned with smooth animations
 * - Uses existing checkout form functionality
 * - Separate styling (does not affect existing components)
 */

const POPUP_INTERVAL_MS = 10000; // 10 seconds

export const CheckoutPopupModal: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isManualPopupOpen, isAnyPopupVisible, setIsAnyPopupVisible } = usePopupState();
  
  const productId = searchParams.get('id') || DEFAULT_PRODUCT_ID;
  const clickid = (() => {
    const urlClickid = searchParams.get('clickid') || '';
    if (urlClickid) return urlClickid;
    
    try {
      const stored = localStorage.getItem(`pt_clickid_${productId}`);
      if (stored) return stored;
      const globalClickid = localStorage.getItem('playtonight_clickid');
      if (globalClickid) return globalClickid;
    } catch {}
    
    let generatedClickid: string;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      generatedClickid = crypto.randomUUID();
    } else {
      generatedClickid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    
    try {
      localStorage.setItem(`pt_clickid_${productId}`, generatedClickid);
    } catch {}
    
    return generatedClickid;
  })();

  const [product, setProduct] = useState<{ price: number; priceDisplay: string; name: string; currency?: string; description?: string; checkouturl?: string; successurl?: string; failurl?: string; } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    quantity: 1
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPopupActiveRef = useRef(false);

  // Fetch product details when popup becomes visible
  useEffect(() => {
    if (!isVisible) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetails({ id: productId, clickid });
        
        const priceRaw = productData?.price;
        const priceNumber = Number(priceRaw);
        
        if (Number.isFinite(priceNumber)) {
          setProduct({
            price: priceNumber,
            priceDisplay: typeof priceRaw === 'string' || typeof priceRaw === 'number' 
              ? String(priceRaw) 
              : String(priceNumber),
            name: productData?.name || productData?.productName || productData?.product_name || 'Product',
            currency: productData?.currency || 'INR',
            description: productData?.description,
            checkouturl: productData?.checkouturl,
            successurl: productData?.successurl,
            failurl: productData?.failurl
          });
        } else {
          setProduct({
            price: 0,
            priceDisplay: '0',
            name: 'Product'
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct({
          price: 0,
          priceDisplay: '0',
          name: 'Product'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isVisible, productId, clickid]);

  // Calculate total price based on quantity and dynamic price
  const unitPrice = product?.price || 0;
  const currency = product?.currency || 'INR';
  const discountPercent = 50; // Default discount
  const totalPrice = unitPrice * formData.quantity;

  // Show popup function
  const showPopup = useCallback(() => {
    // Prevent multiple popups from stacking
    if (isPopupActiveRef.current || isAnyPopupVisible) return;
    
    isPopupActiveRef.current = true;
    setIsAnyPopupVisible(true);
    setIsVisible(true);
    setIsClosing(false);
    
    // Disable background scroll
    document.body.classList.add('popup-modal-open');
  }, [isAnyPopupVisible, setIsAnyPopupVisible]);

  // Hide popup function with animation
  const hidePopup = useCallback(() => {
    setIsClosing(true);
    
    // Wait for close animation to complete
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      isPopupActiveRef.current = false;
      setIsAnyPopupVisible(false);
      
      // Re-enable background scroll
      document.body.classList.remove('popup-modal-open');
    }, 400); // Match CSS transition duration
  }, [setIsAnyPopupVisible]);

  // Setup auto-popup interval
  useEffect(() => {
    // Don't start timer if manual popup is currently open or any popup is visible
    if (isManualPopupOpen || isAnyPopupVisible) return;
    
    const timer = setTimeout(() => {
      // Double check before showing popup
      if (!isManualPopupOpen && !isAnyPopupVisible) {
        showPopup();
      }
    }, POPUP_INTERVAL_MS);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('popup-modal-open');
    };
  }, [showPopup, isManualPopupOpen, isAnyPopupVisible]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle quantity changes
  const handleQuantityChange = (change: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, prev.quantity + change))
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!productId || !clickid) {
      alert('Missing required parameters. Please refresh the page.');
      return;
    }
    
    if (!product || !Number.isFinite(product.price)) {
      alert('Product details not loaded yet. Please wait and try again.');
      return;
    }

    const numericProductId = Number(productId);
    if (!Number.isFinite(numericProductId)) {
      alert('Invalid product ID');
      return;
    }

    try {
      setIsSubmitting(true);

      // Save user data first
      await saveUserDataProduct({
        msisdn: formData.phoneNumber,
        productId: numericProductId,
        clickId: clickid,
        productName: product.name,
      });

      // Prepare checkout payload
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
        currency: currency,
        qty: formData.quantity,
        shippingMethod: 'free',
        clickid,
        productInfo: null,
      };

      // Initiate checkout
      const data = await initiateCheckout({
        productId: numericProductId,
        payload,
      });

      // Navigate to PayU redirect page
      navigate('/checkout/payu-redirect', {
        state: {
          actionUrl: 'https://secure.payu.in/_payment',
          params: data,
          successurl: data.successurl,
          failurl: data.failurl,
        },
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Handle overlay click (close popup)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      hidePopup();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        hidePopup();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isVisible, hidePopup]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div 
      className={`popup-checkout-overlay ${isVisible && !isClosing ? 'popup-visible' : ''} ${isClosing ? 'popup-closing' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-checkout-title"
    >
      <div className="popup-checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button - Inside the modal */}
        <button 
          className="popup-close-btn-outer" 
          onClick={hidePopup}
          aria-label="Close popup"
          type="button"
        >
          ×
        </button>

        {/* Header */}
        <div className="popup-modal-header">
          <h2 id="popup-checkout-title" className="popup-modal-title">
            Complete Your Order
          </h2>
        </div>

        {/* Body */}
        <div className="popup-modal-body">
          {/* Logo Section */}
          <div className="popup-logo-section">
            <div className="popup-logo-badge">
              <span className="popup-logo-text">PlayTonight - Be Young Forever</span>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="popup-payment-card" style={{textAlign: 'center'}}>
            <p className="popup-payment-text">
              <span style={{fontSize: '12px'}}>Proceed further to complete the payment of </span>
              <span style={{fontSize: '18px', fontWeight: 'bold'}}>
                <span style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>{loading ? '...' : formatPrice(unitPrice * 2, currency)}</span>
                <span style={{color: '#e74c3c', fontWeight: 'bold'}}>{loading ? '...' : formatPrice(totalPrice, currency)} ({discountPercent}% OFF)</span>
              </span>
            </p>
          </div>

          {/* Checkout Form */}
          <form className="popup-checkout-form" onSubmit={handleSubmit}>
            <div className="popup-form-group">
              <label htmlFor="popup-name">Your Name</label>
              <input
                type="text"
                id="popup-name"
                name="name"
                className="popup-form-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                autoComplete="name"
              />
            </div>

            <div className="popup-form-group">
              <label htmlFor="popup-phone">Mobile Number</label>
              <input
                type="tel"
                id="popup-phone"
                name="phoneNumber"
                className="popup-form-input"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter You WhatsApp Number"
                required
                autoComplete="tel"
              />
            </div>

            <div className="popup-form-group">
              <label htmlFor="popup-quantity">Quantity</label>
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
                  id="popup-quantity"
                  name="quantity"
                  className="popup-qty-input"
                  value={formData.quantity}
                  readOnly
                  min="1"
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
              On successful purchase, you will get a WhatsApp message on your registered mobile number. Reply with your complete shipping address.
            </div>

            {/* Timer Badge */}
            {/* <div className="popup-timer-badge">
              <span className="popup-timer-icon">⏰</span>
              <span className="popup-timer-text">Offer expires soon - Don't miss out!</span>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SCROLL TO BOTTOM POPUP - Auto-appearing when user reaches page end
// =====================================================

export const ScrollToBottomPopup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasManualPopupOpened, isManualPopupOpen, isAnyPopupVisible, setIsAnyPopupVisible } = usePopupState();
  
  const productId = searchParams.get('id') || DEFAULT_PRODUCT_ID;
  const clickid = (() => {
    const urlClickid = searchParams.get('clickid') || '';
    if (urlClickid) return urlClickid;
    
    try {
      const stored = localStorage.getItem(`pt_clickid_${productId}`);
      if (stored) return stored;
      const globalClickid = localStorage.getItem('playtonight_clickid');
      if (globalClickid) return globalClickid;
    } catch {}
    
    let generatedClickid: string;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      generatedClickid = crypto.randomUUID();
    } else {
      generatedClickid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    
    try {
      localStorage.setItem(`pt_clickid_${productId}`, generatedClickid);
    } catch {}
    
    return generatedClickid;
  })();

  const [product, setProduct] = useState<{ price: number; priceDisplay: string; name: string; currency?: string; description?: string; checkouturl?: string; successurl?: string; failurl?: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    quantity: 1
  });

  // Fetch product details when popup becomes visible
  useEffect(() => {
    if (!isVisible) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetails({ id: productId, clickid });
        
        const priceRaw = productData?.price;
        const priceNumber = Number(priceRaw);
        
        if (Number.isFinite(priceNumber)) {
          setProduct({
            price: priceNumber,
            priceDisplay: typeof priceRaw === 'string' || typeof priceRaw === 'number' 
              ? String(priceRaw) 
              : String(priceNumber),
            name: productData?.name || productData?.productName || productData?.product_name || 'Product',
            currency: productData?.currency || 'INR',
            description: productData?.description,
            checkouturl: productData?.checkouturl,
            successurl: productData?.successurl,
            failurl: productData?.failurl
          });
        } else {
          setProduct({
            price: 0,
            priceDisplay: '0',
            name: 'Product'
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct({
          price: 0,
          priceDisplay: '0',
          name: 'Product'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isVisible, productId, clickid]);

  // Calculate total price based on quantity and dynamic price
  const unitPrice = product?.price || 0;
  const currency = product?.currency || 'INR';
  const discountPercent = 50; // Default discount
  const totalPrice = unitPrice * formData.quantity;

  // Show popup function
  const showPopup = useCallback(() => {
    if (hasTriggered || hasManualPopupOpened || isManualPopupOpen || isAnyPopupVisible) return;
    
    setHasTriggered(true);
    setIsAnyPopupVisible(true);
    setIsVisible(true);
    setIsClosing(false);
    
    // Disable background scroll
    document.body.classList.add('popup-modal-open');
  }, [hasTriggered, hasManualPopupOpened, isManualPopupOpen, isAnyPopupVisible, setIsAnyPopupVisible]);

  // Hide popup function with animation
  const hidePopup = useCallback(() => {
    setIsClosing(true);
    
    // Wait for close animation to complete
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setIsAnyPopupVisible(false);
      
      // Re-enable background scroll
      document.body.classList.remove('popup-modal-open');
    }, 400); // Match CSS transition duration
  }, [setIsAnyPopupVisible]);

  // Setup scroll listener for page end detection
  useEffect(() => {
    if (hasTriggered || hasManualPopupOpened || isManualPopupOpen || isAnyPopupVisible) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if user has reached the bottom of the page
      if (scrollTop + windowHeight >= documentHeight - 10) {
        showPopup();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('popup-modal-open');
    };
  }, [showPopup, hasTriggered, hasManualPopupOpened, isManualPopupOpen, isAnyPopupVisible]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle quantity changes
  const handleQuantityChange = (change: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, prev.quantity + change))
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!productId || !clickid) {
      alert('Missing required parameters. Please refresh the page.');
      return;
    }
    
    if (!product || !Number.isFinite(product.price)) {
      alert('Product details not loaded yet. Please wait and try again.');
      return;
    }

    const numericProductId = Number(productId);
    if (!Number.isFinite(numericProductId)) {
      alert('Invalid product ID');
      return;
    }

    try {
      setIsSubmitting(true);

      // Save user data first
      await saveUserDataProduct({
        msisdn: formData.phoneNumber,
        productId: numericProductId,
        clickId: clickid,
        productName: product.name,
      });

      // Prepare checkout payload
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
        currency: currency,
        qty: formData.quantity,
        shippingMethod: 'free',
        clickid,
        productInfo: null,
      };

      // Initiate checkout
      const data = await initiateCheckout({
        productId: numericProductId,
        payload,
      });

      // Navigate to PayU redirect page
      navigate('/checkout/payu-redirect', {
        state: {
          actionUrl: 'https://secure.payu.in/_payment',
          params: data,
          successurl: data.successurl,
          failurl: data.failurl,
        },
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Handle overlay click (close popup)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      hidePopup();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        hidePopup();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isVisible, hidePopup]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div 
      className={`popup-checkout-overlay ${isVisible && !isClosing ? 'popup-visible' : ''} ${isClosing ? 'popup-closing' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scroll-popup-checkout-title"
    >
      <div className="popup-checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button - Inside the modal */}
        <button 
          className="popup-close-btn-outer" 
          onClick={hidePopup}
          aria-label="Close popup"
          type="button"
        >
          ×
        </button>

        {/* Header */}
        <div className="popup-modal-header">
          <h2 id="scroll-popup-checkout-title" className="popup-modal-title">
            Complete Your Order
          </h2>
        </div>

        {/* Body */}
        <div className="popup-modal-body">
          {/* Logo Section */}
          <div className="popup-logo-section">
            <div className="popup-logo-badge">
              <span className="popup-logo-text">PlayTonight - Be Young Forever</span>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="popup-payment-card" style={{textAlign: 'center'}}>
            <p className="popup-payment-text">
              <span style={{fontSize: '12px'}}>Proceed further to complete the payment of </span>
              <span style={{fontSize: '18px', fontWeight: 'bold'}}>
                <span style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>{loading ? '...' : formatPrice(unitPrice * 2, currency)}</span>
                <span style={{color: '#e74c3c', fontWeight: 'bold'}}>{loading ? '...' : formatPrice(totalPrice, currency)} ({discountPercent}% OFF)</span>
              </span>
            </p>
          </div>

          {/* Checkout Form */}
          <form className="popup-checkout-form" onSubmit={handleSubmit}>
            <div className="popup-form-group">
              <label htmlFor="scroll-popup-name">Your Name</label>
              <input
                type="text"
                id="scroll-popup-name"
                name="name"
                className="popup-form-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                autoComplete="name"
              />
            </div>

            <div className="popup-form-group">
              <label htmlFor="scroll-popup-phone">Mobile Number</label>
              <input
                type="tel"
                id="scroll-popup-phone"
                name="phoneNumber"
                className="popup-form-input"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter You WhatsApp Number"
                required
                autoComplete="tel"
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
                  value={formData.quantity}
                  readOnly
                  min="1"
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
              On successful purchase, you will get a WhatsApp message on your registered mobile number. Reply with your complete shipping address.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const WhatsAppWidget: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setHasManualPopupOpened, setIsManualPopupOpen, setIsAnyPopupVisible } = usePopupState();
  
  const productId = searchParams.get('id') || DEFAULT_PRODUCT_ID;
  const clickid = (() => {
    const urlClickid = searchParams.get('clickid') || '';
    if (urlClickid) return urlClickid;
    
    try {
      const stored = localStorage.getItem(`pt_clickid_${productId}`);
      if (stored) return stored;
      const globalClickid = localStorage.getItem('playtonight_clickid');
      if (globalClickid) return globalClickid;
    } catch {}
    
    let generatedClickid: string;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      generatedClickid = crypto.randomUUID();
    } else {
      generatedClickid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    
    try {
      localStorage.setItem(`pt_clickid_${productId}`, generatedClickid);
    } catch {}
    
    return generatedClickid;
  })();

  const [product, setProduct] = useState<{ price: number; priceDisplay: string; name: string; currency?: string; description?: string; checkouturl?: string; successurl?: string; failurl?: string; } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    quantity: 1
  });

  // Track manual popup state
  useEffect(() => {
    setIsManualPopupOpen(isOpen);
    setIsAnyPopupVisible(isOpen);
  }, [isOpen, setIsManualPopupOpen, setIsAnyPopupVisible]);

  // Fetch product details when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetails({ id: productId, clickid });
        
        const priceRaw = productData?.price;
        const priceNumber = Number(priceRaw);
        
        if (Number.isFinite(priceNumber)) {
          setProduct({
            price: priceNumber,
            priceDisplay: typeof priceRaw === 'string' || typeof priceRaw === 'number' 
              ? String(priceRaw) 
              : String(priceNumber),
            name: productData?.name || productData?.productName || productData?.product_name || 'Product',
            currency: productData?.currency || 'INR',
            description: productData?.description,
            checkouturl: productData?.checkouturl,
            successurl: productData?.successurl,
            failurl: productData?.failurl
          });
        } else {
          setProduct({
            price: 0,
            priceDisplay: '0',
            name: 'Product'
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct({
          price: 0,
          priceDisplay: '0',
          name: 'Product'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId, clickid]);
  
  const handleQuantityChange = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      quantity: increment ? prev.quantity + 1 : Math.max(1, prev.quantity - 1)
    }));
  };
  
  // Add currency and discount variables for display
  const currency = product?.currency || 'INR';
  const discountPercent = 50; // Default discount
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!productId || !clickid) {
      alert('Missing required parameters. Please refresh the page.');
      return;
    }
    
    if (!product || !Number.isFinite(product.price)) {
      alert('Product details not loaded yet. Please wait and try again.');
      return;
    }

    const numericProductId = Number(productId);
    if (!Number.isFinite(numericProductId)) {
      alert('Invalid product ID');
      return;
    }

    const unitPrice = product.price;
    const currency = product?.currency || 'INR';
    const discountPercent = 50; // Default discount
    const totalPrice = unitPrice * formData.quantity;

    try {
      setIsSubmitting(true);

      // Save user data first
      await saveUserDataProduct({
        msisdn: formData.phoneNumber,
        productId: numericProductId,
        clickId: clickid,
        productName: product.name,
      });

      // Prepare checkout payload
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
        currency: currency,
        qty: formData.quantity,
        shippingMethod: 'free',
        clickid,
        productInfo: null,
      };

      // Initiate checkout
      const data = await initiateCheckout({
        productId: numericProductId,
        payload,
      });

      // Navigate to PayU redirect page
      navigate('/checkout/payu-redirect', {
        state: {
          actionUrl: 'https://secure.payu.in/_payment',
          params: data,
          successurl: data.successurl,
          failurl: data.failurl,
        },
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="whatsapp-widget">
      <button 
        className="whatsapp-button"
        onClick={() => {
          setHasManualPopupOpened(true);
          setIsOpen(!isOpen);
        }}
      >
        Order Now
      </button>
      
      {isOpen && (
        <div className="whatsapp-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close button - Inside the modal */}
            <button className="whatsapp-close-btn-outer" onClick={() => setIsOpen(false)} type="button">×</button>
            
            <div className="modal-header">
              <h2 className="modal-title">Complete Your Order</h2>
            </div>
            <div className="modal-logo-section">
              <div className="logo-circle">
                <div className="logo-content">
                  <span className="logo-text">PlayTonight - Be Young Forever</span>
                </div>
              </div>
            </div>
            <div className="payment-info-box" style={{textAlign: 'center'}}>
              <p className="payment-text">
                <span style={{fontSize: '12px'}}>Proceed further to complete the payment of </span>
                <span className="highlight" style={{fontSize: '18px', fontWeight: 'bold'}}>
                  <span style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>{loading ? '...' : formatPrice((product?.price || 0) * formData.quantity * 2, currency)}</span>
                  <span style={{color: '#e74c3c', fontWeight: 'bold'}}>{loading ? '...' : formatPrice((product?.price || 0) * formData.quantity, currency)} ({discountPercent}% OFF)</span>
                </span>
              </p>
            </div>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                id="name" 
                name="name"
                placeholder="Enter your name" 
                required 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Mobile Number</label>
              <input 
                id="phoneNumber" 
                name="phoneNumber"
                placeholder="Enter You WhatsApp Number" 
                required 
                type="tel" 
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-selector">
                <button 
                  type="button" 
                  className="quantity-btn minus" 
                  disabled={formData.quantity <= 1}
                  onClick={() => handleQuantityChange(false)}
                >−</button>
                <input 
                  id="quantity" 
                  name="quantity"
                  readOnly 
                  className="quantity-input" 
                  min="1" 
                  type="number" 
                  value={formData.quantity}
                />
                <button 
                  type="button" 
                  className="quantity-btn plus"
                  onClick={() => handleQuantityChange(true)}
                >+</button>
              </div>
            </div>
            <button 
              type="submit" 
              className="complete-order-btn"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Processing...' : 'Complete Order'}
            </button>
            
            <div className="whatsapp-message-info">
              On successful purchase, you will get a WhatsApp message on your registered mobile number. Reply with your complete shipping address.
            </div>
          </form>
          </div>
        </div>
      )}
    </div>
  );
};
