import React from 'react';

const Ornaments = ({ variant = 'divider', className = '' }) => {
  const variants = {
    divider: (
      <div className={`flex items-center justify-center gap-4 ${className}`}>
        <span className="text-[#D4AF37] text-2xl">✦</span>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
        <span className="text-[#D4AF37] text-xl">◆</span>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
        <span className="text-[#D4AF37] text-2xl">✦</span>
      </div>
    ),
    corner: (
      <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L2 20M2 2L20 2M2 2L15 15" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="10" cy="10" r="1.5" fill="#D4AF37"/>
      </svg>
    ),
    flourish: (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-[#D4AF37] text-xl">✧</span>
        <span className="text-[#D4AF37] text-2xl">❖</span>
        <span className="text-[#D4AF37] text-xl">✧</span>
      </div>
    ),
    frame: (
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        <svg className="absolute top-0 left-0" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M2 2L2 30M2 2L30 2" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg className="absolute top-0 right-0" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M78 2L78 30M78 2L50 2" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg className="absolute bottom-0 left-0" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M2 78L2 50M2 78L30 78" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <svg className="absolute bottom-0 right-0" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M78 78L78 50M78 78L50 78" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    )
  };

  return variants[variant] || variants.divider;
};

export default Ornaments;