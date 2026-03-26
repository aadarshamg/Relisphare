import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const EmailSignupForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for local development
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store email in localStorage for persistence (No Supabase)
      const existingEmails = JSON.parse(localStorage.getItem('relicsphere_emails') || '[]');
      if (!existingEmails.includes(email)) {
        existingEmails.push(email);
        localStorage.setItem('relicsphere_emails', JSON.stringify(existingEmails));
      }

      toast({
        title: "Success!",
        description: "Thank you! We'll notify you when we open.",
        duration: 5000
      });

      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className="flex-1 px-6 py-3 rounded-lg bg-[#F5E6D3] text-[#2C2C2C] placeholder:text-[#8B4513]/60 border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-['Georgia',serif] text-base"
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="px-8 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:from-[#A0522D] hover:to-[#8B4513] text-[#F5E6D3] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-[#D4AF37]/50"
      >
        {isLoading ? 'Submitting...' : 'Notify Me'}
      </Button>
    </motion.form>
  );
};

export default EmailSignupForm;