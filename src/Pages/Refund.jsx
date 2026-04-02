import Footer from '../components/Footer';

export default function RefundCancellationPolicyComponent() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)', minHeight: '100vh' }}>
      <nav style={{ background: '#000047' }} className="shadow-md">
        <div className="flex items-center mx-auto px-4 py-3 max-w-6xl">
          <h1 className="font-bold text-white text-xl">PLAY TONIGHT</h1>
        </div>
      </nav>
      <section className="mx-2 sm:mx-auto my-10 p-6 sm:p-10 rounded-2xl max-w-4xl" style={{ background: 'rgba(20,20,40,0.95)', border: '1px solid rgba(255,107,53,0.15)' }}>
        <header className="mb-8">
          <h1 className="pb-3 font-bold text-white text-3xl sm:text-4xl tracking-tight" style={{ borderBottom: '1px solid rgba(255,107,53,0.3)' }}>
            Refund & Cancellation Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed" style={{ color: '#b0b0b0' }}>
            This Refund & Cancellation Policy applies to all purchases made through{' '}
            <a href="https://playtonight.fun/" style={{ color: '#ff6b35' }} className="hover:underline">https://playtonight.fun/</a>,
            managed by Zeen Mediconnect OPC Pvt. Ltd. Please read it carefully before placing an order.
          </p>
        </header>

        <div className="space-y-8 max-w-none" style={{ color: '#b0b0b0' }}>
          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Order Cancellation</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>Orders can be cancelled within 24 hours of placing the order, provided the order has not already been processed or shipped.</li>
              <li>
                To request cancellation, please contact us immediately at{' '}
                <a href="mailto:enquiry@zeenmediconnect.com" style={{ color: '#ff6b35' }} className="hover:underline">enquiry@zeenmediconnect.com</a>{' '}
                /{' '}
                <a href="tel:+911244477054" style={{ color: '#ff6b35' }} className="hover:underline">+91 124 4477054</a>{' '}
                with your order details.
              </li>
              <li>Once an order is shipped, it cannot be cancelled.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Refund Eligibility</h2>
            <p className="mt-3">Refunds are applicable only under the following conditions:</p>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>You received a wrong product that does not match your order.</li>
              <li>The product was damaged during delivery (requires proof such as photos at the time of delivery).</li>
              <li>The product is expired or defective upon arrival.</li>
            </ul>
            <p className="mt-3 italic" style={{ color: '#888' }}>
              Note: Refunds are not applicable for opened, used, or partially consumed products due to the nature of herbal and Ayurvedic consumables.
            </p>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Refund Process</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>To initiate a refund, you must notify us within 2 days of receiving the product.</li>
              <li>Once your request is verified and approved, refunds will be processed to your original payment method within 7–10 working days.</li>
              <li>In some cases, you may be asked to return the product (unused and in original packaging) before a refund is issued.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Non-Refundable Items</h2>
            <p className="mt-3">We do not accept returns or issue refunds for:</p>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>Opened or partially used herbal/ayurvedic products.</li>
              <li>Products purchased during promotional sales or discounts.</li>
              <li>Digital or downloadable content (if applicable).</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Shipping & Return Costs</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>If the return is due to our error (wrong, damaged, or expired product), we will bear the return shipping charges.</li>
              <li>If the return is due to customer reasons (e.g., order placed by mistake, change of mind), the customer must bear the return shipping cost.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Contact Us</h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mt-3">
              <div className="space-y-3">
                <p className="font-medium text-white">Email</p>
                <p><a href="mailto:enquiry@zeenmediconnect.com" style={{ color: '#ff6b35' }} className="hover:underline">enquiry@zeenmediconnect.com</a></p>
                <p className="font-medium text-white">Phone</p>
                <p><a href="tel:+911244477054" style={{ color: '#ff6b35' }} className="hover:underline">+91 124 4477054</a></p>
              </div>
              <div className="space-y-3">
                <p className="font-medium text-white">Address</p>
                <address className="not-italic leading-relaxed">
                  Zeen Mediconnect OPC Pvt. Ltd.,<br />
                  UNIT NO. 417, TOWER A1, TECH PARK, SOHNA ROAD, SEC 49,<br />
                  GURGAON, SADAR BAZAR, Gurugram, Haryana-122001
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
