import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Ornaments from '@/components/Ornaments';
import EmailSignupForm from '@/components/EmailSignupForm';

const ComingSoonPage = () => {
  return (
    <>
      <Helmet>
        <title>Relicsphere - Coming Soon | Discover Timeless Antique Treasures</title>
        <meta 
          name="description" 
          content="Relicsphere is opening soon. Sign up to be notified when we launch our collection of rare, timeless antique treasures." 
        />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1642027180032-f66feee943d8)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2C]/95 via-[#8B4513]/80 to-[#2C2C2C]/95"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C] via-transparent to-transparent"></div>
        </div>

        {/* Decorative Frame */}
        <Ornaments variant="frame" />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Top Flourish */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Ornaments variant="flourish" className="mb-8" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold text-[#F5E6D3] mb-4 tracking-wider"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Relicsphere
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Ornaments variant="divider" className="my-8" />
            </motion.div>

            {/* Subheading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-[#D4AF37] mb-6 tracking-wide"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Coming Soon
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-[#F5E6D3]/90 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Step into a world where history whispers through every piece. 
              Relicsphere curates exceptional antique treasures, each with a story to tell. 
              Discover rare collectibles, vintage furniture, and timeless artifacts that 
              transform your space into a gallery of refined elegance.
            </motion.p>

            {/* Email Signup Form */}
            <EmailSignupForm />

            {/* Bottom Ornament */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12"
            >
              <Ornaments variant="flourish" />
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16 space-y-4"
            >
              <p className="text-[#D4AF37]/80 text-sm tracking-widest uppercase">
                ✦ Carefully Curated Collections ✦
              </p>
              <p className="text-[#F5E6D3]/70 text-sm max-w-xl mx-auto">
                From Victorian elegance to mid-century modern, every piece in our collection 
                is authenticated and preserved with meticulous care.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              #D4AF37 50px,
              #D4AF37 51px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              #D4AF37 50px,
              #D4AF37 51px
            )`
          }}></div>
        </div>
      </div>
    </>
  );
};

export default ComingSoonPage;