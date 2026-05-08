
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle, Star, Clock, Shield, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { formatRupees } from '@/utils/currencyFormatter';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Consultation',
    price: 500,
    duration: '30 Minutes',
    color: '#8B4513',
    badge: 'Popular',
    features: [
      'One-on-one expert session',
      'Antique identification & valuation',
      'Authenticity assessment tips',
      'Market price guidance',
      'Follow-up email summary',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Consultation',
    price: 1000,
    duration: '60 Minutes',
    color: '#D4AF37',
    badge: 'Best Value',
    features: [
      'Everything in Basic',
      'In-depth provenance research',
      'Restoration & care advice',
      'Investment potential analysis',
      'Buying & selling strategy',
      'Priority WhatsApp support (7 days)',
    ],
  },
];

const ConsultancyPage = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast({ title: 'Select a Plan', description: 'Please choose a consultation plan first.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    // Simulate booking submission
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast({
      title: '🎉 Booking Confirmed!',
      description: `Your ${selectedPlan.name} (${formatRupees(selectedPlan.price)}) is booked. We'll contact you shortly.`,
      className: 'bg-[#2C2C2C] text-[#F5E6D3] border-[#D4AF37]',
    });
    setForm({ name: '', email: '', phone: '', message: '' });
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF]">
      <Helmet>
        <title>Consultancy | Relicsphere</title>
        <meta name="description" content="Book an expert antique consultancy session with Relicsphere. Get professional guidance on valuation, authenticity, and more." />
      </Helmet>

      {/* Hero */}
      <div className="bg-[#2C2C2C] text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8B4513 0%, transparent 50%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4 fill-current" /> Expert Antique Consultation
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Unlock the Story<br />Behind Your Antiques
          </h1>
          <p className="text-[#E5D3B3] text-lg leading-relaxed max-w-2xl mx-auto">
            Speak directly with our certified antique specialists. Get professional valuations, authenticity checks, and expert advice — all from the comfort of your home.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Certified Experts', desc: '15+ years of experience in antique authentication and valuation across India.' },
            { icon: Clock, title: 'Flexible Timing', desc: 'Book sessions at your convenience, including weekends and evenings.' },
            { icon: MessageSquare, title: 'Detailed Follow-up', desc: 'Receive a written summary and recommendations after every session.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-[#E5D3B3] text-center">
              <div className="w-14 h-14 bg-[#F5E6D3] rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-[#8B4513]" />
              </div>
              <h3 className="font-serif font-bold text-[#2C2C2C] text-lg mb-2">{title}</h3>
              <p className="text-[#5C4033] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-[#2C2C2C] mb-2">Choose Your Plan</h2>
          <p className="text-center text-[#8B4513] mb-10">Select the consultation that best fits your needs</p>

          <div className="grid md:grid-cols-2 gap-8">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative bg-white rounded-2xl shadow-md cursor-pointer transition-all duration-300 p-8 border-2 ${
                    isSelected ? 'border-[#D4AF37] shadow-xl scale-[1.02]' : 'border-transparent hover:border-[#E5D3B3] hover:shadow-lg'
                  }`}
                >
                  {/* Badge */}
                  <span
                    className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: plan.color }}
                  >
                    {plan.badge}
                  </span>

                  {/* Selected indicator */}
                  {isSelected && (
                    <CheckCircle className="absolute top-4 left-4 w-6 h-6 text-[#D4AF37]" />
                  )}

                  <h3 className="font-serif font-bold text-2xl text-[#2C2C2C] mt-2 mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold" style={{ color: plan.color }}>{formatRupees(plan.price)}</span>
                    <span className="text-gray-400 text-sm">/ session</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#8B4513] text-sm font-medium mb-6">
                    <Clock className="w-4 h-4" /> {plan.duration}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[#5C4033] text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-[#E5D3B3] p-10">
          <h2 className="text-3xl font-serif font-bold text-[#2C2C2C] mb-2">Book Your Session</h2>
          {selectedPlan ? (
            <p className="text-[#8B4513] mb-8">
              Selected: <strong>{selectedPlan.name}</strong> — <strong>{formatRupees(selectedPlan.price)}</strong>
            </p>
          ) : (
            <p className="text-gray-400 mb-8 italic">Please select a plan above first.</p>
          )}

          <form onSubmit={handleBook} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required value={form.name} onChange={handleChange} className="bg-[#FAF5EF] border-[#E5D3B3]" placeholder="Rajesh Kumar" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="bg-[#FAF5EF] border-[#E5D3B3]" placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} className="bg-[#FAF5EF] border-[#E5D3B3]" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="message">What would you like help with?</Label>
              <Textarea id="message" name="message" value={form.message} onChange={handleChange} className="bg-[#FAF5EF] border-[#E5D3B3] min-h-[120px] resize-none" placeholder="Describe the antique or topic you need guidance on..." />
            </div>

            {/* Summary */}
            {selectedPlan && (
              <div className="bg-[#FAF5EF] border border-[#E5D3B3] rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-[#2C2C2C]">{selectedPlan.name}</p>
                  <p className="text-sm text-[#8B4513]">{selectedPlan.duration}</p>
                </div>
                <span className="text-2xl font-bold text-[#D4AF37]">{formatRupees(selectedPlan.price)}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !selectedPlan}
              className="w-full bg-[#8B4513] hover:bg-[#5C4033] text-white py-6 text-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Phone className="mr-2 w-5 h-5" />}
              {loading ? 'Booking...' : `Book Now — ${selectedPlan ? formatRupees(selectedPlan.price) : 'Select a Plan'}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultancyPage;
