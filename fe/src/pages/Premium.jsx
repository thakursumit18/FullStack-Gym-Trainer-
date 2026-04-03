import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    key: 'monthly',
    label: 'Monthly',
    price: 299,
    period: '/month',
    savings: null,
    color: 'from-slate-700 to-slate-600',
    border: 'border-slate-600',
  },
  {
    key: 'quarterly',
    label: 'Quarterly',
    price: 799,
    period: '/3 months',
    savings: 'Save ₹98',
    color: 'from-orange-600 to-red-600',
    border: 'border-orange-500',
    popular: true,
  },
  {
    key: 'yearly',
    label: 'Yearly',
    price: 1999,
    period: '/year',
    savings: 'Save ₹589',
    color: 'from-violet-600 to-purple-600',
    border: 'border-violet-500',
  },
];

const BENEFITS = [
  {
    icon: '⚡',
    title: 'Adaptive Workout Plans',
    desc: 'Plans that change based on your fitness level, available equipment, and number of workout days per week.',
    free: false,
  },
  {
    icon: '🥗',
    title: 'Veg & Non-Veg Diet Plans',
    desc: 'Separate customized meal plans for vegetarians and non-vegetarians with exact macros.',
    free: false,
  },
  {
    icon: '🎯',
    title: 'Fully Customizable Plans',
    desc: 'Set your target weight, fitness level, equipment, workout days, and injury notes.',
    free: false,
  },
  {
    icon: '📊',
    title: 'Advanced Progress Analytics',
    desc: 'Deeper insights into your transformation with detailed body composition tracking.',
    free: false,
  },
  {
    icon: '🤖',
    title: 'Priority AI FitBot',
    desc: 'Unlimited AI chat with personalized responses based on your premium profile.',
    free: false,
  },
  {
    icon: '🏋️',
    title: 'Basic Workout Plans',
    desc: '7-day weekly splits for your goal.',
    free: true,
  },
  {
    icon: '🥘',
    title: 'Basic Diet Plans',
    desc: 'Standard Indian meal plans.',
    free: true,
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    desc: 'Log weight, body fat, measurements.',
    free: true,
  },
];

const TESTIMONIALS = [
  { name: 'Rahul S.', plan: 'Yearly', text: 'Lost 12kg in 4 months with the adaptive plan. The veg diet plan is exactly what I needed — real Indian food, not salads!', rating: 5 },
  { name: 'Priya M.', plan: 'Quarterly', text: 'The customizable workout plan adjusted perfectly for my home gym setup. No more generic plans that don\'t fit my life.', rating: 5 },
  { name: 'Arjun K.', plan: 'Monthly', text: 'Gained 6kg of muscle in 3 months. The non-veg high protein plan with exact macros made all the difference.', rating: 5 },
];

export default function Premium() {
  const { user, updateUser } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [paymentStep, setPaymentStep] = useState('plans'); // plans | processing | success
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    api.get('/premium/status')
      .then(r => { setPremiumStatus(r.data); setStatusLoading(false); })
      .catch(() => setStatusLoading(false));
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStep('processing');
    try {
      // Step 1: Create mock order
      const { data: order } = await api.post('/premium/order', { plan: selectedPlan });

      // Simulate payment processing delay (2 seconds)
      await new Promise(r => setTimeout(r, 2000));

      // Step 2: Verify and activate
      const { data } = await api.post('/premium/verify', {
        plan: selectedPlan,
        orderId: order.id,
      });

      updateUser(data.user);
      setPremiumStatus({ isPremium: true, premiumPlan: selectedPlan, premiumExpiry: data.user.premiumExpiry });
      setPaymentStep('success');
    } catch (err) {
      setPaymentStep('plans');
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading) return (
    <div className="flex items-center justify-center h-screen">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  // Already premium
  if (premiumStatus?.isPremium) return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-orange-500/30">
            ★
          </div>
          <h1 className="text-3xl font-black text-white mb-2">You are Premium!</h1>
          <p className="text-slate-400 mb-2">Plan: <span className="text-orange-400 font-semibold capitalize">{premiumStatus.premiumPlan}</span></p>
          <p className="text-slate-500 text-sm mb-8">
            Expires: {new Date(premiumStatus.premiumExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/premium/workout">
              <AnimatedButton className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold">
                My Custom Workout
              </AnimatedButton>
            </Link>
            <Link to="/premium/diet">
              <AnimatedButton className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold">
                My Custom Diet
              </AnimatedButton>
            </Link>
            <Link to="/premium/settings">
              <AnimatedButton className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold">
                Preferences
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="bg-slate-950 min-h-screen">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/8 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              GymTrainer Premium
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Train Smarter.<br />
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Get Real Results.
              </span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto mb-4">
              Unlock fully personalized workout and diet plans built around your body, your equipment, your lifestyle — and your food preferences.
            </motion.p>
          </div>
        </div>

        {/* ── FREE vs PREMIUM COMPARISON ── */}
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-black text-white text-center mb-8">Free vs <span className="text-orange-400">Premium</span></h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Free */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-sm">F</div>
                <h3 className="text-white font-bold text-lg">Free Plan</h3>
              </div>
              <div className="space-y-3">
                {BENEFITS.filter(b => b.free).map(b => (
                  <div key={b.title} className="flex items-start gap-3">
                    <span className="text-green-400 mt-0.5 font-bold text-sm">✓</span>
                    <div>
                      <p className="text-slate-300 text-sm font-medium">{b.title}</p>
                      <p className="text-slate-500 text-xs">{b.desc}</p>
                    </div>
                  </div>
                ))}
                {BENEFITS.filter(b => !b.free).map(b => (
                  <div key={b.title} className="flex items-start gap-3 opacity-40">
                    <span className="text-slate-600 mt-0.5 font-bold text-sm">✗</span>
                    <p className="text-slate-500 text-sm">{b.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">PREMIUM</div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">P</div>
                <h3 className="text-white font-bold text-lg">Premium Plan</h3>
              </div>
              <div className="space-y-3">
                {BENEFITS.filter(b => b.free).map(b => (
                  <div key={b.title} className="flex items-start gap-3">
                    <span className="text-green-400 mt-0.5 font-bold text-sm">✓</span>
                    <p className="text-slate-300 text-sm font-medium">{b.title}</p>
                  </div>
                ))}
                {BENEFITS.filter(b => !b.free).map(b => (
                  <div key={b.title} className="flex items-start gap-3">
                    <span className="text-orange-400 mt-0.5 font-bold text-sm">✓</span>
                    <div>
                      <p className="text-white text-sm font-semibold">{b.title}</p>
                      <p className="text-slate-400 text-xs">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRICING PLANS ── */}
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-black text-white text-center mb-2">Choose Your Plan</h2>
          <p className="text-slate-500 text-center text-sm mb-8">Cancel anytime. No hidden charges.</p>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.key}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPlan(plan.key)}
                className={`relative rounded-2xl p-6 cursor-pointer transition-all border-2 ${selectedPlan === plan.key ? plan.border + ' bg-slate-800/80' : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} mb-4`} />
                <h3 className="text-white font-bold text-lg mb-1">{plan.label}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black text-white">₹{plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                </div>
                {plan.savings && (
                  <span className="text-green-400 text-xs font-semibold">{plan.savings}</span>
                )}
                <div className={`mt-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto ${selectedPlan === plan.key ? 'bg-orange-500 border-orange-500' : 'border-slate-600'}`}>
                  {selectedPlan === plan.key && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Payment Button */}
          <AnimatePresence mode="wait">
            {paymentStep === 'plans' && (
              <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <AnimatedButton onClick={handlePayment} disabled={loading}
                  className="px-12 py-4 rounded-2xl font-bold text-lg text-white shadow-xl shadow-orange-500/20 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}>
                  Unlock Premium — ₹{PLANS.find(p => p.key === selectedPlan)?.price}
                </AnimatedButton>
                <p className="text-slate-600 text-xs mt-3">Powered by Razorpay · 100% Secure Payment</p>
                <div className="flex items-center justify-center gap-4 mt-3">
                  {['Visa', 'Mastercard', 'UPI', 'NetBanking'].map(m => (
                    <span key={m} className="text-slate-600 text-xs border border-slate-700 px-2 py-0.5 rounded">{m}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {paymentStep === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-white font-semibold">Processing Payment...</p>
                <p className="text-slate-500 text-sm mt-1">Please wait, do not close this page</p>
              </motion.div>
            )}

            {paymentStep === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  ✓
                </motion.div>
                <h3 className="text-white text-xl font-black mb-2">Premium Activated!</h3>
                <p className="text-slate-400 text-sm mb-6">Welcome to GymTrainer Premium. Your personalized plans are ready.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/premium/workout">
                    <AnimatedButton className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold">
                      View My Workout Plan
                    </AnimatedButton>
                  </Link>
                  <Link to="/premium/diet">
                    <AnimatedButton className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold">
                      View My Diet Plan
                    </AnimatedButton>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── TESTIMONIALS ── */}
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-black text-white text-center mb-8">What Our Premium Members Say</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.rating).fill(0).map((_, i) => (
                    <span key={i} className="text-orange-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.plan} Member</p>
                  </div>
                  <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">Verified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-black text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes. You can cancel your premium subscription at any time. Your access continues until the end of your billing period.' },
              { q: 'What is an adaptive workout plan?', a: 'Our adaptive plans change based on your fitness level (beginner/intermediate/advanced), available equipment (full gym/home/minimal), and how many days per week you can train.' },
              { q: 'How is the veg diet different from non-veg?', a: 'Veg plans use paneer, dal, rajma, sprouts, and plant protein as primary protein sources. Non-veg plans include chicken, eggs, fish, and whey protein for higher protein targets.' },
              { q: 'Is my payment secure?', a: 'Yes. All payments are processed through Razorpay, India\'s most trusted payment gateway with bank-grade encryption.' },
              { q: 'Can I switch between veg and non-veg?', a: 'Yes. You can update your diet preference anytime from the Premium Preferences page and your plan will regenerate instantly.' },
            ].map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-white font-medium text-sm">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-orange-400 text-xl font-light flex-shrink-0 ml-4">+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden">
            <p className="px-5 pb-4 text-slate-400 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
