import Footer from '../components/Footer';

export default function Disclaimer() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)', minHeight: '100vh' }}>
      <nav style={{ background: '#000047' }} className="shadow-md">
        <div className="flex items-center mx-auto px-4 py-3 max-w-6xl">
          <h1 className="font-bold text-white text-xl">PLAY TONIGHT</h1>
        </div>
      </nav>
      <section className="mx-2 sm:mx-auto my-10 p-6 sm:p-10 rounded-2xl max-w-4xl" style={{ background: 'rgba(20,20,40,0.95)', border: '1px solid rgba(255,107,53,0.15)' }}>
        <header className="mb-8">
          <h1 className="font-bold text-white text-3xl sm:text-4xl tracking-tight">Disclaimer</h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed" style={{ color: '#b0b0b0' }}>
            The information below applies to{' '}
            <a href="https://playtonight.fun/" style={{ color: '#ff6b35' }} className="hover:underline">https://playtonight.fun/</a>{' '}
            and the Company — Zeen Mediconnect OPC Pvt. Ltd.
          </p>
        </header>

        <div className="space-y-8 max-w-none" style={{ color: '#b0b0b0' }}>
          <p>
            The information provided on{' '}
            <a href="https://playtonight.fun/" style={{ color: '#ff6b35' }} className="hover:underline">https://playtonight.fun/</a>{' '}
            is for general informational and educational purposes only. By using this Website, you acknowledge and agree to the following disclaimers:
          </p>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>No Medical Advice</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>The content on this Website is not a substitute for professional medical advice, diagnosis, or treatment.</li>
              <li>Always consult a qualified healthcare professional before starting any herbal, Ayurvedic, or dietary supplement regimen.</li>
              <li>Never disregard or delay seeking medical advice because of something you read on this Website.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Product Disclaimer</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>Our products are based on traditional Ayurvedic and herbal practices. Results may vary from person to person.</li>
              <li>The Company does not claim to diagnose, treat, cure, or prevent any disease.</li>
              <li>Statements regarding our products have not been evaluated by medical authorities unless explicitly stated.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Accuracy of Information</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>While we strive to keep information accurate and up to date, we make no representations or warranties regarding completeness, accuracy, or reliability.</li>
              <li>Any reliance you place on the information is strictly at your own risk.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>External Links</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>This Website may include links to third-party websites for informational purposes.</li>
              <li>We are not responsible for the content, accuracy, or practices of external sites and disclaim liability for any damages arising from their use.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Limitation of Liability</h2>
            <p className="mb-3">To the fullest extent permitted by law, the Company shall not be held liable for any loss, injury, or damage arising from:</p>
            <ul className="space-y-2 pl-6 list-disc">
              <li>use of or reliance on Website content,</li>
              <li>use of our products, or</li>
              <li>inability to access the Website.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>User Responsibility</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>By using this Website, you acknowledge that you are solely responsible for your health decisions.</li>
              <li>You agree that the Company shall not be held liable for your personal choices or outcomes resulting from use of our information or products.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Consent</h2>
            <p>By accessing and using this Website, you consent to this Disclaimer and agree to all its terms.</p>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Contact Us</h2>
            <div className="gap-8 grid grid-cols-1 md:grid-cols-2 mt-3">
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
