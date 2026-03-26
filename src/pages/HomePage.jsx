import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { name: 'Furniture', image: 'https://images.unsplash.com/photo-1581761391840-8a1fdf090c1a' },
  { name: 'Coins', image: 'https://images.unsplash.com/photo-1494122474412-aeaf73d11da8' },
  { name: 'Paintings', image: 'https://images.unsplash.com/photo-1630002931917-964ccb95d0a5' },
  { name: 'Sculptures', image: 'https://images.unsplash.com/photo-1696593165785-c28a6501d9aa' },
  { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1637313172311-7c1eee620d89' },
];

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Relicsphere | Timeless Antique Treasures</title>
        <meta name="description" content="Discover rare antiques, vintage furniture, and timeless collectibles at Relicsphere." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1642027180032-f66feee943d8)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C2C2C]/80 via-[#2C2C2C]/50 to-[#2C2C2C]/90"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <motion.img
              src="https://horizons-cdn.hostinger.com/037bde25-b36f-425a-8f08-2d594dea4bfb/672903cb83c6bc20266416e73729efb7.png"
              alt="Relicsphere Logo"
              className="h-24 md:h-32 w-auto mx-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                y: {
                  repeat: Infinity, 
                  duration: 3, 
                  ease: "easeInOut" 
                }
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-[#F5E6D3] mb-6 drop-shadow-lg embassy-font">
              Relicsphere
            </h1>
            <p className="text-xl md:text-2xl text-[#DEB887] mb-8 max-w-2xl mx-auto font-light tracking-wide">
              Where history lives on. Discover an exquisite collection of rare artifacts and timeless elegance.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#2C2C2C] font-bold text-lg px-8 py-6 rounded-full transition-transform hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-[#F5E6D3]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="text-[#8B4513] font-serif italic tracking-widest">- OUR HERITAGE -</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] embassy-font">Curating the Extraordinary</h2>
            <div className="h-1 w-24 bg-[#D4AF37] mx-auto"></div>
            <p className="text-lg text-[#5C4033] leading-relaxed">
              At Relicsphere, we believe every object has a soul. Founded by historians and passionate collectors, 
              we travel the globe to rescue forgotten treasures. From the opulent halls of Victorian estates to the 
              dusty corners of ancient markets, we hand-select pieces that speak of craftsmanship, history, and beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-20 bg-gradient-to-b from-[#F5E6D3] to-[#E8DCC4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4 embassy-font">Browse by Category</h2>
            <p className="text-[#8B4513]">Find the perfect piece for your collection</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-80 rounded-xl overflow-hidden shadow-xl cursor-pointer"
              >
                <Link to={`/shop?category=${cat.name}`}>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white drop-shadow-md border-2 border-transparent group-hover:border-[#D4AF37] px-6 py-2 transition-all duration-300 embassy-font">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teaser */}
      <section className="py-24 bg-[#2C2C2C] text-[#F5E6D3] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B4513] rounded-full filter blur-[100px] opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 embassy-font">New Arrivals Weekly</h2>
          <p className="text-xl text-[#DEB887] mb-12 max-w-2xl mx-auto">
            Our inventory is constantly evolving. Sign up for our newsletter to get first access to rare finds before they disappear.
          </p>
          <Link to="/shop">
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C2C2C] text-lg px-8 py-6">
              View All Products <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;