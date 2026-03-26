import React from 'react';
import { Helmet } from 'react-helmet';

const RefundAndCancellationPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF5EF] py-12">
      <Helmet>
        <title>Refund & Cancellation Policy | Relicsphere</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-2">Refund & Cancellation Policy</h1>
        <p className="text-[#8B4513] mb-8 font-serif italic">Effective Date: 08 February 2026</p>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm space-y-8 text-[#5C4033] leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">1. Order Cancellation</h2>
            <p>
              You may request a cancellation of your order within 24 hours of purchase or before the item has been dispatched, 
              whichever is earlier. Once an order has been shipped, it cannot be cancelled. To cancel an order, please contact 
              our support team immediately at support@relicsphere.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">2. Refund Eligibility</h2>
            <p className="mb-4">Refunds are only processed under the following specific conditions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The item received is significantly different from the description or photos provided.</li>
              <li>The item was damaged during transit (proof of damage, including photos of packaging and item, must be submitted within 48 hours of delivery).</li>
              <li>The item is proven to be inauthentic (requires verification from a recognized authority).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">3. Exclusions</h2>
            <p>
              Due to the vintage and antique nature of our products, we do not offer refunds for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Change of mind.</li>
              <li>Minor imperfections, wear, or aging marks that were disclosed in the description or visible in photos.</li>
              <li>Damage caused by the customer after delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">4. Refund Processing</h2>
            <p>
              Once your return is received and inspected, we will send you an email to notify you that we have received your 
              returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then 
              your refund will be processed, and a credit will automatically be applied to your credit card or original method 
              of payment within 7-10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-4">5. Shipping Costs</h2>
            <p>
              Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your 
              refund unless the return is due to our error or transit damage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundAndCancellationPage;