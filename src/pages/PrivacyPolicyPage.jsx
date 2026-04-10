import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF5EF] py-12">
      <Helmet>
        <title>Privacy Policy | Relicsphere</title>
        <meta name="description" content="E commerce stores for antique Shop" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-2">Privacy Policy</h1>
        <p className="text-[#8B4513] mb-8 font-serif italic">Effective Date: 08 February 2026</p>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm space-y-8 text-[#5C4033] leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">1. Our Commitment to Privacy</h2>
            <p>
              At Relicsphere, we value your trust and are committed to protecting your personal information. This Privacy Policy 
              outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect information that you provide to us directly, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal Identification: Name, email address, phone number.</li>
              <li>Shipping Information: Physical address for delivery.</li>
              <li>Payment Information: Credit card details (processed securely by third-party payment providers).</li>
              <li>Account Credentials: Username and password for account access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">3. How We Use Your Data</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders.</li>
              <li>Communicate with you regarding your order status or support inquiries.</li>
              <li>Improve our website functionality and user experience.</li>
              <li>Send promotional emails about new arrivals (only if you have opted in).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">4. Third-Party Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except 
              to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long 
              as those parties agree to keep this information confidential (e.g., shipping carriers, payment processors).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">5. Cookies</h2>
            <p>
              We use cookies to enhance your experience, gather general visitor information, and track visits to our website. 
              You may choose to turn off all cookies via your browser settings, but some services may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">6. Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. Your personal 
              information is contained behind secured networks and is only accessible by a limited number of persons who have 
              special access rights to such systems.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;