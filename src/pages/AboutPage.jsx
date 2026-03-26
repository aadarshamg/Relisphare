import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, History, Phone, Mail, HelpCircle, Loader2 } from 'lucide-react';
import { useContactInfo } from '@/hooks/useContactInfo';

const AboutPage = () => {
  const { contactInfo, loading } = useContactInfo();

  const phone = contactInfo?.contact_phone || '6350213774';
  const supportEmail = contactInfo?.support_email || 'support@relicsphere.com';
  const contactEmail = contactInfo?.contact_email || 'contact@relicsphere.com';

  return (
    <div className="min-h-screen bg-[#FAF5EF]">
      <Helmet>
        <title>About Us | Relicsphere</title>
        <meta name="description" content="Learn about Relicsphere's mission to preserve history through authentic antiques and vintage treasures." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 bg-[#2C2C2C] text-[#F5E6D3] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C2C2C]/90 via-[#2C2C2C]/60 to-[#2C2C2C]/90" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#D4AF37] embassy-font">Preserving History</h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-[#DEB887]">
              Bridging the gap between the past and the present through the art of collection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-[#8B4513] font-serif italic text-lg tracking-widest">OUR MISSION</span>
              <h2 className="text-4xl font-bold text-[#2C2C2C] embassy-font">Honoring the Past</h2>
              <p className="text-[#5C4033] leading-relaxed text-lg">
                At Relicsphere, we believe that every artifact tells a story. Our mission is to rescue, restore, and rehome 
                forgotten treasures from around the world. We are not just selling objects; we are custodians of history, 
                ensuring that the craftsmanship and artistry of bygone eras continue to be appreciated.
              </p>
              <p className="text-[#5C4033] leading-relaxed text-lg">
                Whether it's a Victorian coin, a mid-century sculpture, or a piece of colonial furniture, each item in our 
                collection is hand-selected for its historical significance and aesthetic beauty.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 border-2 border-[#D4AF37] rounded-lg opacity-50 transform rotate-2"></div>
              <img 
                src="https://images.unsplash.com/photo-1596627689948-438994d5027c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Antique collection" 
                className="rounded-lg shadow-2xl relative z-10 w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#F5E6D3]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4 embassy-font">Our Core Values</h2>
            <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FAF5EF] p-8 rounded-xl shadow-lg border-t-4 border-[#8B4513] text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#2C2C2C] embassy-font">Authenticity</h3>
              <p className="text-[#5C4033]">
                We guarantee the authenticity of every piece we sell. Our experts rigorously vet each item to ensure it is genuine and accurately described.
              </p>
            </div>

            <div className="bg-[#FAF5EF] p-8 rounded-xl shadow-lg border-t-4 border-[#8B4513] text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#2C2C2C] embassy-font">Transparency</h3>
              <p className="text-[#5C4033]">
                We believe in full disclosure. We document all conditions, wear, and history known to us, so you know exactly what you are acquiring.
              </p>
            </div>

            <div className="bg-[#FAF5EF] p-8 rounded-xl shadow-lg border-t-4 border-[#8B4513] text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#2C2C2C] embassy-font">Careful Sourcing</h3>
              <p className="text-[#5C4033]">
                Our network extends to private estates and auctions globally. We treat every item with the respect it deserves, from acquisition to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Added Contact Details Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative">
           <div className="max-w-4xl mx-auto bg-white rounded-2xl p-12 shadow-sm border border-[#D4AF37]/20 text-center relative overflow-hidden">
             {loading && (
               <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm">
                 <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
               </div>
             )}

             <h2 className="text-3xl font-bold text-[#2C2C2C] mb-6 embassy-font">Get In Touch</h2>
             <p className="text-[#5C4033] mb-8 max-w-2xl mx-auto">
               We love hearing from fellow history enthusiasts. Whether you have a question about a piece or just want to share your passion, reach out to us.
             </p>
             
             <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 relative z-0">
               <div className="flex flex-col items-center gap-3">
                 <div className="bg-[#FAF5EF] p-4 rounded-full">
                    <Phone className="w-6 h-6 text-[#8B4513]" />
                 </div>
                 <a href={`tel:${phone}`} className="text-lg font-semibold text-[#2C2C2C] hover:text-[#D4AF37] transition-colors">
                   {phone}
                 </a>
                 <span className="text-sm text-gray-500">Call Us</span>
               </div>
               
               <div className="flex flex-col items-center gap-3">
                 <div className="bg-[#FAF5EF] p-4 rounded-full">
                    <HelpCircle className="w-6 h-6 text-[#8B4513]" />
                 </div>
                 <a href={`mailto:${supportEmail}`} className="text-lg font-semibold text-[#2C2C2C] hover:text-[#D4AF37] transition-colors">
                   {supportEmail}
                 </a>
                 <span className="text-sm text-gray-500">Support Email</span>
               </div>

               <div className="flex flex-col items-center gap-3">
                 <div className="bg-[#FAF5EF] p-4 rounded-full">
                    <Mail className="w-6 h-6 text-[#8B4513]" />
                 </div>
                 <a href={`mailto:${contactEmail}`} className="text-lg font-semibold text-[#2C2C2C] hover:text-[#D4AF37] transition-colors">
                   {contactEmail}
                 </a>
                 <span className="text-sm text-gray-500">General Inquiries</span>
               </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;