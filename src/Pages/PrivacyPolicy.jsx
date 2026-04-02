import Footer from '../components/Footer';

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed" style={{ color: '#b0b0b0' }}>
            This Privacy Policy describes how Zeen Mediconnect OPC Pvt. Ltd. collects, uses, stores, and protects your personal information when you use{' '}
            <a href="https://playtonight.fun/" style={{ color: '#ff6b35' }} className="hover:underline">https://playtonight.fun/</a>{' '}
            (the "Website"). By accessing or using our Website, you agree to the terms of this Privacy Policy.
          </p>
          <p className="mt-3 leading-relaxed" style={{ color: '#b0b0b0' }}>
            We are committed to safeguarding your privacy and ensuring your personal data is handled responsibly and transparently.
          </p>
        </header>

        <div className="space-y-8 max-w-none" style={{ color: '#b0b0b0' }}>
          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Information We Collect</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li><span className="font-medium text-white">Personal Information:</span> Name, email address, phone number, billing/shipping address, and payment details.</li>
              <li><span className="font-medium text-white">Non-Personal Information:</span> Browser type, device details, IP address, cookies, and usage data.</li>
              <li><span className="font-medium text-white">Voluntary Submissions:</span> Information you provide through forms, surveys, or direct communication.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>How We Use Your Information</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>Processing and fulfilling your orders.</li>
              <li>Providing customer support and responding to inquiries.</li>
              <li>Sending updates, promotions, or service-related communications (if you opt-in).</li>
              <li>Improving our Website's functionality, user experience, and services.</li>
              <li>Legal and security purposes, such as fraud prevention and compliance with applicable laws.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Sharing of Information</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li><span className="font-medium text-white">Service Providers:</span> Trusted third parties (e.g., payment processors, delivery partners) who assist in running our services.</li>
              <li><span className="font-medium text-white">Legal Requirements:</span> Authorities, if required by law, regulation, or legal process.</li>
              <li><span className="font-medium text-white">Business Transfers:</span> In the event of a merger, acquisition, or restructuring, your data may be transferred to the new entity.</li>
            </ul>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Cookies & Tracking Technologies</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>Enhance user experience.</li>
              <li>Track website traffic and performance.</li>
              <li>Store user preferences.</li>
            </ul>
            <p className="mt-3">You can adjust your browser settings to decline cookies, but some features of the Website may not function properly.</p>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Data Security</h2>
            <p className="mt-3">We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, misuse, loss, or alteration. However, no method of online transmission or storage is 100% secure.</p>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Data Retention</h2>
            <p className="mt-3">We retain your personal information only as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.</p>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Your Rights</h2>
            <ul className="space-y-2 mt-3 pl-6 list-disc">
              <li>Access, update, or correct your personal information.</li>
              <li>Request deletion of your personal data.</li>
              <li>Withdraw consent for marketing communications.</li>
              <li>Restrict or object to certain data processing activities.</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at{' '}
              <a href="mailto:enquiry@zeenmediconnect.com" style={{ color: '#ff6b35' }} className="hover:underline">enquiry@zeenmediconnect.com</a>.
            </p>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Third-Party Links</h2>
            <p className="mt-3">Our Website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external sites.</p>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Children's Privacy</h2>
            <p className="mt-3">Our Website and services are not intended for children under 18 years of age. We do not knowingly collect personal information from minors.</p>
          </div>

          <div>
            <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Changes to this Privacy Policy</h2>
            <p className="mt-3">We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date. Continued use of our Website after changes indicates your acceptance of the revised policy.</p>
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
