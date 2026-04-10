import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, HelpCircle } from 'lucide-react';
import { useContactInfo } from '@/hooks/useContactInfo';

const Footer = () => {
  const { contactInfo } = useContactInfo();

  const address = contactInfo?.address || '114 BLDG NO 03 86 CENTRAL,\nANDHERI GHATKOPAR LINK RD,\nMumbai- 400086, Maharashtra';
  const phone = contactInfo?.contact_phone || '6350213774';
  const supportEmail = contactInfo?.support_email || 'support@relicsphere.com';
  const contactEmail = contactInfo?.contact_email || 'contact@relicsphere.com';
  const siteName = contactInfo?.site_name || 'Relicsphere';
  const description = contactInfo?.description || 'E commerce stores for antique Shop';

  return (
    <footer className="bg-[#2C2C2C] text-[#F5E6D3] pt-16 pb-8 border-t-4 border-[#D4AF37]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="text-3xl font-serif font-bold text-[#F5E6D3] flex items-center gap-3 hover:opacity-90 transition-opacity duration-300">
               <img 
                src="https://horizons-cdn.hostinger.com/037bde25-b36f-425a-8f08-2d594dea4bfb/672903cb83c6bc20266416e73729efb7.png"
                alt="Relicsphere Logo"
                className="h-14 w-auto object-contain"
              />
              <span className="text-[#D4AF37] embassy-font">{siteName}</span>
            </Link>
            <p className="text-[#DEB887]/80 leading-relaxed text-sm">
              {description}
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="hover:text-[#D4AF37] transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-[#D4AF37]">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-[#D4AF37] transition-colors">All Collections</Link></li>
              <li><Link to="/shop?category=Furniture" className="hover:text-[#D4AF37] transition-colors">Antique Furniture</Link></li>
              <li><Link to="/shop?category=Paintings" className="hover:text-[#D4AF37] transition-colors">Fine Art</Link></li>
              <li><Link to="/shop?category=Jewelry" className="hover:text-[#D4AF37] transition-colors">Vintage Jewelry</Link></li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-[#D4AF37]">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#D4AF37] transition-colors">Refund & Cancellation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-[#D4AF37]">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="bg-[#D4AF37]/10 p-2 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                   <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                </div>
                <span className="mt-1 leading-relaxed whitespace-pre-line">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                 <div className="bg-[#D4AF37]/10 p-2 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                   <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                 </div>
                <a href={`tel:${phone}`} className="hover:text-[#D4AF37] transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                 <div className="bg-[#D4AF37]/10 p-2 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                   <HelpCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs text-[#DEB887]/60">Support</span>
                    <a href={`mailto:${supportEmail}`} className="hover:text-[#D4AF37] transition-colors">
                    {supportEmail}
                    </a>
                 </div>
              </li>
              <li className="flex items-center gap-3 group">
                 <div className="bg-[#D4AF37]/10 p-2 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                   <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs text-[#DEB887]/60">Inquiries</span>
                    <a href={`mailto:${contactEmail}`} className="hover:text-[#D4AF37] transition-colors">
                    {contactEmail}
                    </a>
                 </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#DEB887]/60 text-center gap-4">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Developed and Managed by{' '}
            <a 
              href="https://falqonstudio.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#D4AF37] hover:text-[#F5E6D3] transition-colors duration-300 font-semibold"
            >
              Falqon Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;