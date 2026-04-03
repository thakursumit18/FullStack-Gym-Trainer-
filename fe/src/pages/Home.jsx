import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Activity, ChevronRight, BarChart4, User, Target, Flame, Quote, GraduationCap, Banknote, ShieldAlert, Home as HomeIcon } from 'lucide-react';

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
  { img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', title: 'Personalized Workout Plans', desc: 'AI-generated 7-day splits based on your goal — Lose Fat, Gain Muscle, or Maintain.', badge: 'Workouts' },
  { img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80', title: 'Indian Diet Plans', desc: 'Budget-friendly meals with roti, dal, paneer, eggs — real food you actually eat.', badge: 'Diet' },
  { img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80', title: 'Track Your Progress', desc: 'Log weight, body fat, measurements. See your transformation with beautiful charts.', badge: 'Progress' },
  { img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=80', title: 'AI Fitness Chatbot', desc: 'Ask FitBot anything in English or Hinglish — your 24/7 personal fitness buddy.', badge: 'FitBot AI' },
];

const QUOTES = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Success starts with self-discipline.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
];

const FEATURES = [
  { icon: <Target className="w-8 h-8 text-cyan-400" />, title: 'Smart Workout Plans', desc: '7-day personalized splits for fat loss, muscle gain, or maintenance. 45+ exercises with form tips.' },
  { icon: <Activity className="w-8 h-8 text-cyan-400" />, title: 'Indian Diet Plans', desc: 'Budget-friendly meals with roti, dal, paneer & eggs. Calories & protein calculated for your goal.' },
  { icon: <BarChart4 className="w-8 h-8 text-cyan-400" />, title: 'Progress Tracker', desc: 'Log weight, body fat, measurements. Beautiful Recharts graphs show your transformation.' },
  { icon: <Zap className="w-8 h-8 text-cyan-400" />, title: 'AI FitBot', desc: 'Ask anything in English or Hinglish. Powered by Gemini AI — your 24/7 fitness buddy.' },
  { icon: <Flame className="w-8 h-8 text-cyan-400" />, title: 'Streak System', desc: 'Track your workout streak, longest streak, and 7-day consistency dots to stay motivated.' },
  { icon: <User className="w-8 h-8 text-cyan-400" />, title: 'BMI & Body Fat', desc: 'Auto-calculated BMI with color-coded scale. Track body fat % trend over time.' },
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
    <div className="bg-[#030712] text-white overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* ── HUD / GAMIFIED HERO ──────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#030712]">
        
        {/* Dynamic Architectural Grid & Gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center">
          <motion.div animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[20%] w-[800px] h-[600px] bg-cyan-600/20 rounded-[100%] blur-[120px]" />
          <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-0 w-[600px] h-[500px] bg-violet-600/30 rounded-[100%] blur-[100px]" />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 flex flex-col lg:flex-row items-center gap-16">
          
          {/* LEFT CONTENT */}
          <div className="flex-1 text-center lg:text-left z-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 text-xs font-mono uppercase tracking-widest font-semibold">Initiating Sequence // V1.0</span>
              </div>

              <h1 className="text-5xl sm:text-7xl font-black leading-[1.1] mb-6 tracking-tight text-white">
                LEVEL UP <br />
                YOUR <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">PHYSIQUE</span>
              </h1>
              
              <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
                Experience fitness redefined. AI-generated routines, precision diet tracking, and a dynamic progression system designed to hack your limitations over time.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/signup" className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
                  <motion.button whileTap={{ scale: 0.95 }} className="relative w-full sm:w-auto px-8 py-4 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center gap-3 transition-colors">
                    <span className="text-white font-bold tracking-wide uppercase text-sm">Deploy Now</span>
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto px-8 py-4 rounded-lg font-bold tracking-wide uppercase text-sm text-slate-300 bg-slate-900/50 border border-slate-700/50 backdrop-blur transition-all flex items-center justify-center gap-2">
                    Access Terminal <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* RIGHT CONTENT - GAMIFIED HUD */}
          <motion.div initial={{ opacity: 0, scale: 0.9, rotateX: 10 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 1, delay: 0.2 }} className="flex-1 w-full max-w-md lg:max-w-none perspective-1000 hidden md:block">
            <div className="relative bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-[0_0_40px_rgba(8,145,178,0.1)] overflow-hidden">
              
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="flex justify-between items-center mb-8 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-xs uppercase tracking-wider">User.SYS</div>
                    <div className="text-white font-bold leading-tight tracking-wide">LVL. 12 ATHLETE</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-mono font-bold text-lg cursor-default">24,500 <span className="text-xs text-cyan-600">XP</span></div>
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[68%]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-black/40 border border-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-cyan-500" />
                      <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Current Streak</span>
                    </div>
                    <div className="text-3xl font-black text-white">14 <span className="text-sm font-medium text-slate-500">DAYS</span></div>
                  </div>
                  <svg width="60" height="40" className="opacity-70">
                    <path d="M0,30 Q15,40 30,20 T60,10" fill="none" stroke="#06b6d4" strokeWidth="3" />
                  </svg>
                </div>
                <div className="bg-black/40 border border-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Workout Load</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">85%</div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[85%]" />
                  </div>
                </div>
                <div className="bg-black/40 border border-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-violet-400" />
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Goal Accur.</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">92%</div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400 w-[92%]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -inset-x-10 top-1/2 h-px bg-cyan-500/20 blur-[2px] -z-10" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-violet-500/20 blur-[2px] -z-10" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex items-center justify-center w-8 h-12 border border-slate-600/50 rounded-full bg-slate-950/50 backdrop-blur-md">
            <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
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
            <div className="text-cyan-500/50 flex justify-center mb-6"><Quote size={40} /></div>
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
              { icon: <GraduationCap size={40} className="mb-3 text-cyan-400" />, title: 'College Students', desc: 'Stay fit on a tight budget with free plans that actually work.' },
              { icon: <Banknote size={40} className="mb-3 text-cyan-400" />, title: 'Budget Users', desc: 'No expensive trainer fees. Get the same results for free.' },
              { icon: <ShieldAlert size={40} className="mb-3 text-cyan-400" />, title: 'Beginners', desc: 'Step-by-step guidance with exercise images and form tips.' },
              { icon: <HomeIcon size={40} className="mb-3 text-cyan-400" />, title: 'Home Warriors', desc: 'Workout plans that work at home or at the gym.' },
            ].map((u, i) => (
              <FadeUp key={u.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-center transition-all flex flex-col items-center">
                  {u.icon}
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
                  className="px-10 py-4 rounded-2xl font-bold text-xl text-slate-900 shadow-2xl shadow-cyan-500/40"
                  style={{ background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)' }}>
                  Initialize Account
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
            <Activity className="text-cyan-500 w-6 h-6" />
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
