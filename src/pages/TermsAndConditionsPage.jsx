import React from 'react';
import { Helmet } from 'react-helmet';

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF5EF] py-12">
      <Helmet>
        <title>Terms & Conditions | Relicsphere</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-2">Terms & Conditions</h1>
        <p className="text-[#8B4513] mb-8 font-serif italic">Effective Date: 08 February 2026</p>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm space-y-8 text-[#5C4033] leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">1. Introduction</h2>
            <p>
              Welcome to Relicsphere. By accessing or using our website, you agree to be bound by these Terms and Conditions. 
              Please read them carefully before making any purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">2. Antique & Vintage Items</h2>
            <p>
              All items sold on Relicsphere are vintage or antique in nature. This means they have been previously owned and used. 
              Signs of wear, age, and use are to be expected and are often part of the charm and history of the item. We strive to 
              describe and photograph all items accurately, including any significant flaws. However, minor imperfections consistent 
              with age may not always be noted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">3. Product Images & Descriptions</h2>
            <p>
              We make every effort to display the colors and details of our products accurately. However, we cannot guarantee that 
              your computer monitor's display of any color will be accurate. Product descriptions are made to the best of our knowledge 
              and research.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">4. Pricing & Modifications</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue 
              the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any 
              third-party for any modification, price change, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">5. Intellectual Property</h2>
            <p>
              All content included on this site, such as text, graphics, logos, images, and software, is the property of Relicsphere 
              or its content suppliers and protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">6. Limitation of Liability</h2>
            <p>
              In no case shall Relicsphere, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, 
              service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, 
              special, or consequential damages of any kind arising from your use of any of the service or any products procured 
              using the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">7. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at support@relicsphere.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;