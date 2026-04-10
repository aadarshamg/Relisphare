
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Phone, MapPin, Clock, Send, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';

const ContactPage = () => {
  const { toast } = useToast();
  const { addContactSubmission, settings } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addContactSubmission({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      toast({
        title: "Message Sent Successfully",
        description: "We've received your inquiry and will respond shortly.",
        className: "bg-[#2C2C2C] text-[#F5E6D3] border-[#D4AF37]"
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const address = settings?.address || '114 BLDG NO 03 86 CENTRAL,\nANDHERI GHATKOPAR LINK RD,\nMumbai- 400086';
  const phone = settings?.phone || '6350213774';
  const supportEmail = settings?.support_email || 'support@relicsphere.com';

  return (
    <div className="min-h-screen bg-[#FAF5EF] py-16">
      <Helmet>
        <title>Contact Us | Relicsphere</title>
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2C2C] mb-6">Get in Touch</h1>
          <p className="text-[#8B4513] text-lg leading-relaxed">
            E commerce stores for antique Shop
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="space-y-6 relative">
            <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-[#D4AF37]">
              <div className="flex items-start gap-4">
                <div className="bg-[#F5E6D3] p-3 rounded-full flex-shrink-0"><MapPin className="w-6 h-6 text-[#8B4513]" /></div>
                <div>
                  <h3 className="font-serif font-bold text-[#2C2C2C] text-xl mb-2">Office Address</h3>
                  <p className="text-[#5C4033] whitespace-pre-line">{address}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-[#D4AF37]">
              <div className="flex items-start gap-4">
                <div className="bg-[#F5E6D3] p-3 rounded-full flex-shrink-0"><Phone className="w-6 h-6 text-[#8B4513]" /></div>
                <div>
                  <h3 className="font-serif font-bold text-[#2C2C2C] text-xl mb-2">Phone Support</h3>
                  <a href={`tel:${phone}`} className="text-[#5C4033] font-medium text-lg hover:text-[#D4AF37]">{phone}</a>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-[#D4AF37]">
              <div className="flex items-start gap-4">
                <div className="bg-[#F5E6D3] p-3 rounded-full flex-shrink-0"><Mail className="w-6 h-6 text-[#8B4513]" /></div>
                <div className="flex-grow">
                  <h3 className="font-serif font-bold text-[#2C2C2C] text-xl mb-4">Email Us</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <HelpCircle className="w-4 h-4 text-[#8B4513]" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Support</span>
                        <a href={`mailto:${supportEmail}`} className="text-[#5C4033] font-medium hover:text-[#D4AF37]">{supportEmail}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-[#D4AF37]/20 h-fit sticky top-24">
            <h2 className="text-3xl font-serif font-bold text-[#2C2C2C] mb-2">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required value={formData.name} onChange={handleChange} className="bg-[#FAF5EF] border-[#E5D3B3]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={handleChange} className="bg-[#FAF5EF] border-[#E5D3B3]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required value={formData.subject} onChange={handleChange} className="bg-[#FAF5EF] border-[#E5D3B3]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required value={formData.message} onChange={handleChange} className="min-h-[150px] bg-[#FAF5EF] border-[#E5D3B3] resize-none" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#8B4513] hover:bg-[#5C4033] text-white py-6 text-lg">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
