import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ── Scroll-triggered fade-up wrapper ─────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

// ── Counter animation ─────────────────────────────────────────
function Counter({ to, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Feature slideshow ─────────────────────────────────────────
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
    title: 'Personalized Workout Plans',
    desc: 'AI-generated 7-day splits based on your goal — Lose Fat, Gain Muscle, or Maintain.',
    badge: '🏋️ Workouts',
  },
  {
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
    title: 'Indian Diet Plans',
    desc: 'Budget-friendly meals with roti, dal, paneer, eggs — real food you actually eat.',
    badge: '🥗 Diet',
  },
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
    title: 'Track Your Progress',
    desc: 'Log weight, body fat, measurements. See your transformation with beautiful charts.',
    badge: '📊 Progress',
  },
  {
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=80',
    title: 'AI Fitness Chatbot',
    desc: 'Ask FitBot anything in English or Hinglish — your 24/7 personal fitness buddy.',
    badge: '🤖 FitBot AI',
  },
];

const QUOTES = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Success starts with self-discipline.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
];

const FEATURES = [
  { icon: '🏋️', title: 'Smart Workout Plans', desc: '7-day personalized splits for fat loss, muscle gain, or maintenance. 45+ exercises with form tips.' },
  { icon: '🥗', title: 'Indian Diet Plans', desc: 'Budget-friendly meals with roti, dal, paneer & eggs. Calories & protein calculated for your goal.' },
  { icon: '📊', title: 'Progress Tracker', desc: 'Log weight, body fat, measurements. Beautiful Recharts graphs show your transformation.' },
  { icon: '🤖', title: 'AI FitBot', desc: 'Ask anything in English or Hinglish. Powered by Gemini AI — your 24/7 fitness buddy.' },
  { icon: '🔥', title: 'Streak System', desc: 'Track your workout streak, longest streak, and 7-day consistency dots to stay motivated.' },
  { icon: '📈', title: 'BMI & Body Fat', desc: 'Auto-calculated BMI with color-coded scale. Track body fat % trend over time.' },
];

const GALLERY = [
  { img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80', label: 'Strength Training' },
  { img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', label: 'Cardio' },
  { img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', label: 'Nutrition' },
  { img: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80', label: 'Consistency' },
  { img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', label: 'Results' },
  { img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80', label: 'Community' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [quote, setQuote] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto-advance slideshow
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance quotes
  useEffect(() => {
    const t = setInterval(() => setQuote(q => (q + 1) % QUOTES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax BG */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
            alt="gym" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950" />
        </motion.div>

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500 rounded-full blur-3xl" />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Free Personal Trainer App
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
            Your Personal
            <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Gym Trainer
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl font-bold text-slate-300 mt-2">
              Without the Price Tag 💪
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered workout plans, Indian diet plans, progress tracking & a 24/7 fitness chatbot —
            everything a personal trainer gives you, completely free.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                className="px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-lg shadow-orange-500/30 transition-all"
                style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}>
                Start For Free 🚀
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                className="px-8 py-4 rounded-2xl font-bold text-lg text-white border border-slate-600 hover:border-orange-500/50 bg-slate-800/50 backdrop-blur transition-all">
                Login →
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-1 text-slate-500 text-xs">
              <span>Scroll to explore</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-16 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 45, suffix: '+', label: 'Exercises' },
              { value: 3, suffix: '', label: 'Goal Plans' },
              { value: 100, suffix: '%', label: 'Free Forever' },
              { value: 7, suffix: '-Day', label: 'Workout Split' },
            ].map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1} className="text-center">
                <div className="text-4xl font-black text-orange-400">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE SLIDESHOW ─────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Everything You Need to <span className="text-orange-400">Transform</span></h2>
            <p className="text-slate-400 text-lg">One app. All your fitness needs covered.</p>
          </FadeUp>

          <div className="relative rounded-3xl overflow-hidden h-[420px] sm:h-[500px] shadow-2xl shadow-black/50">
            <AnimatePresence mode="wait">
              <motion.div key={slide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                <img src={SLIDES[slide].img} alt={SLIDES[slide].title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Slide content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <AnimatePresence mode="wait">
                <motion.div key={slide} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                  <span className="inline-block bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {SLIDES[slide].badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">{SLIDES[slide].title}</h3>
                  <p className="text-slate-300 text-sm sm:text-base max-w-lg">{SLIDES[slide].desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="absolute top-4 right-4 flex gap-2">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-6 bg-orange-500' : 'w-1.5 bg-slate-500'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Packed With <span className="text-orange-400">Features</span></h2>
            <p className="text-slate-400">Built for beginners, college students & budget-conscious gym users</p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 h-full transition-shadow cursor-default">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOTIVATIONAL QUOTE TICKER ─────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/5 to-orange-500/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeUp>
            <div className="text-5xl mb-6">💬</div>
            <div className="h-28 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div key={quote} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                  <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-3">
                    "{QUOTES[quote].text}"
                  </blockquote>
                  <cite className="text-orange-400 text-sm font-medium not-italic">— {QUOTES[quote].author}</cite>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Quote dots */}
            <div className="flex justify-center gap-2 mt-6">
              {QUOTES.map((_, i) => (
                <button key={i} onClick={() => setQuote(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === quote ? 'bg-orange-500 w-5' : 'bg-slate-600'}`} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PHOTO GALLERY ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Your Journey <span className="text-orange-400">Starts Here</span></h2>
            <p className="text-slate-400">Real fitness. Real results. Real you.</p>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((g, i) => (
              <FadeUp key={g.label} delay={i * 0.07}>
                <motion.div whileHover={{ scale: 1.03 }} className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer group">
                  <img src={g.img} alt={g.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-bold text-sm">{g.label}</span>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Get Started in <span className="text-orange-400">3 Steps</span></h2>
            <p className="text-slate-400">No gym membership. No personal trainer fees. Just results.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📝', title: 'Create Account', desc: 'Sign up free. Enter your age, weight, height and fitness goal.' },
              { step: '02', icon: '🎯', title: 'Get Your Plan', desc: 'Instantly receive a personalized workout split and Indian diet plan.' },
              { step: '03', icon: '📈', title: 'Track & Grow', desc: 'Log daily progress, check streaks, and watch your transformation.' },
            ].map((s, i) => (
              <FadeUp key={s.step} delay={i * 0.15}>
                <div className="relative text-center">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-orange-500/50 to-transparent -translate-y-1/2 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-orange-500/30">
                      {s.icon}
                    </div>
                    <div className="text-orange-500/40 font-black text-5xl absolute -top-3 -left-2 select-none">{s.step}</div>
                    <h3 className="text-white font-bold text-xl mb-2">{s.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARGET USERS ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Built For <span className="text-orange-400">You</span></h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🧑‍🎓', title: 'College Students', desc: 'Stay fit on a tight budget with free plans that actually work.' },
              { icon: '💰', title: 'Budget Users', desc: 'No expensive trainer fees. Get the same results for free.' },
              { icon: '🔰', title: 'Beginners', desc: 'Step-by-step guidance with exercise images and form tips.' },
              { icon: '🏠', title: 'Home Warriors', desc: 'Workout plans that work at home or at the gym.' },
            ].map((u, i) => (
              <FadeUp key={u.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-center transition-all">
                  <div className="text-4xl mb-3">{u.icon}</div>
                  <h3 className="text-white font-bold mb-2">{u.title}</h3>
                  <p className="text-slate-400 text-sm">{u.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1600&q=80"
            alt="cta" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Ready to Start Your
              <span className="block text-orange-400">Transformation? 🔥</span>
            </h2>
            <p className="text-slate-300 text-lg mb-10">
              Join thousands of users who are already training smarter with GymTrainer.
              It's free. It's powerful. It's yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  className="px-10 py-4 rounded-2xl font-bold text-xl text-white shadow-2xl shadow-orange-500/40"
                  style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}>
                  Create Free Account 💪
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  className="px-10 py-4 rounded-2xl font-bold text-xl text-slate-300 border border-slate-600 hover:border-orange-500/50 transition-all">
                  Already a member? Login
                </motion.button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💪</span>
            <span className="text-orange-500 font-black text-lg">GymTrainer</span>
            <span className="text-slate-600 text-sm ml-2">— Your Free Personal Trainer</span>
          </div>
          <div className="flex gap-6 text-slate-500 text-sm">
            <Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-orange-400 transition-colors">Sign Up</Link>
          </div>
          <p className="text-slate-600 text-xs">© 2024 GymTrainer. Built with ❤️ using MERN Stack.</p>
        </div>
      </footer>

    </div>
  );
}
