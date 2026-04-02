import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)', minHeight: '100vh' }}>
      <nav style={{ background: '#000047' }} className="shadow-md">
        <div className="flex items-center mx-auto px-4 py-3 max-w-6xl">
          <h1 className="font-bold text-white text-xl">PLAY TONIGHT</h1>
        </div>
      </nav>
      <section className="mx-2 sm:mx-auto my-10 p-6 sm:p-10 rounded-2xl max-w-4xl" style={{ background: 'rgba(20,20,40,0.95)', border: '1px solid rgba(255,107,53,0.15)' }}>
        <header className="mb-8">
          <h1 className="font-bold text-white text-3xl sm:text-4xl tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed" style={{ color: '#b0b0b0' }}>
            Welcome to{' '}
            <a href="https://playtonight.fun/" style={{ color: '#ff6b35' }} className="hover:underline">
              https://playtonight.fun/
            </a>
            , a website created and managed by Zeen Mediconnect OPC Pvt. Ltd.
            (“Company”, “we”, “us”, or “our”). By accessing or using this
            website, you agree to the following Terms & Conditions.
          </p>
        </header>

        <div className="space-y-6 max-w-none" style={{ color: '#b0b0b0' }}>
          <p>
            Zeen Mediconnect OPC Pvt. Ltd. reserves the right to revise, modify,
            or update these Terms & Conditions at any time without prior notice.
            Continued use of the website indicates your acceptance of any changes.
          </p>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Medical Disclaimer</h2>
          <p>The content on this website is for general informational and educational purposes only. The Company does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before starting any herbal, Ayurvedic, or medical treatment.</p>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Personal Information</h2>
          <p>We may collect personal information voluntarily for registration, order delivery, shipment tracking, and updates via call, SMS, or email. By providing this data, you consent to its collection and use in accordance with our Privacy Policy.</p>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Intellectual Property / Copyright</h2>
          <ul className="space-y-2 pl-6 list-disc">
            <li>All content—including text, graphics, images, videos, logos, and designs—is the property of Zeen Mediconnect OPC Pvt. Ltd.</li>
            <li>Content may only be downloaded if explicitly marked and solely for personal, non-commercial use.</li>
            <li>Reproduction, distribution, or exploitation without prior written consent is prohibited.</li>
          </ul>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>No Warranty & Limitation of Liability</h2>
          <p>This website is provided “AS IS” without warranties of any kind. The Company shall not be liable for any direct, indirect, or consequential damages arising from the use of this website.</p>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>General Terms</h2>
          <ul className="space-y-2 pl-6 list-disc">
            <li>The website is operated from India. Access outside India is at your own responsibility.</li>
            <li>Users are responsible for compliance with their local laws when accessing this website.</li>
            <li>Certain provisions (indemnity, liability, jurisdiction) survive termination of these Terms & Conditions.</li>
          </ul>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Jurisdiction</h2>
          <p>All disputes shall be subject to the exclusive jurisdiction of the courts of Gurugram, Haryana, India. These Terms & Conditions are governed by the laws of India.</p>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Severability</h2>
          <p>If any provision is found invalid or unenforceable, the remaining provisions remain in full force and effect.</p>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>User Responsibilities</h2>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Do not misuse or attempt unauthorized access to the website.</li>
            <li>Do not use the website for unlawful or fraudulent purposes.</li>
            <li>Comply with all applicable laws while using the website.</li>
          </ul>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Third-Party Links</h2>
          <p>This website may contain links to third-party sites. We are not responsible for their content, policies, or practices.</p>

          <h2 className="pb-2 font-semibold text-2xl" style={{ color: '#f7931e', borderBottom: '1px solid rgba(255,107,53,0.3)' }}>Entire Agreement</h2>
          <p>These Terms & Conditions, along with our Privacy Policy, constitute the complete agreement between you and Zeen Mediconnect OPC Pvt. Ltd.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Terms;
