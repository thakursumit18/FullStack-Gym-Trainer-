import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const QUICK_PROMPTS = [
  'How much protein should I eat? 🥩',
  'Best exercises for chest? 💪',
  'How to lose belly fat? 🔥',
  'What is a good workout split? 📅',
  'Creatine lena chahiye? 💊',
  'How to build muscle fast? 🏋️',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 bg-orange-400 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
          🤖
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-orange-500 text-white rounded-br-sm'
          : 'bg-slate-700 text-slate-100 rounded-bl-sm'
      }`}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function ChatBot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: `Hey ${user?.name?.split(' ')[0] || 'yaar'}! 👋 Main FitBot hoon — tera personal fitness buddy. Koi bhi fitness question pooch, main hoon na! 💪🔥` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setError('');

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    // Build history (exclude first bot greeting, only send actual conversation)
    const history = newMessages.slice(1).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));
    // Remove last user message from history (it's the current message)
    history.pop();

    try {
      const { data } = await api.post('/chat', {
        message: msg,
        history,
        userContext: {
          name: user?.name,
          age: user?.age,
          weight: user?.weight,
          height: user?.height,
          goal: user?.goal,
          bodyType: user?.bodyType,
        },
      });
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Yaar, kuch problem ho gayi. Thodi der baad try karo! 😅';
      setError(errMsg);
      setMessages(prev => [...prev, { role: 'bot', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', content: `Hey ${user?.name?.split(' ')[0] || 'yaar'}! 👋 Main FitBot hoon — tera personal fitness buddy. Koi bhi fitness question pooch, main hoon na! 💪🔥` }]);
    setError('');
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30 flex items-center justify-center text-2xl"
      >
        <AnimatePresence mode="wait">
          <motion.span key={open ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}>
            {open ? '✕' : '🤖'}
          </motion.span>
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-orange-500" />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[380px] h-[520px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">🤖</div>
                <div>
                  <p className="text-white font-bold text-sm">FitBot</p>
                  <p className="text-orange-100 text-xs">Your AI Fitness Buddy</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearChat} className="text-white/70 hover:text-white text-xs transition-colors" title="Clear chat">
                  🗑️
                </button>
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors text-lg leading-none">
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              {loading && (
                <div className="flex justify-start mb-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">🤖</div>
                  <div className="bg-slate-700 rounded-2xl rounded-bl-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts — show only at start */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex-shrink-0">
                <p className="text-slate-500 text-xs mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button key={i} onClick={() => sendMessage(p)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-2.5 py-1 rounded-full transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-700 flex-shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Kuch poochna hai? Ask karo... 💬"
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm outline-none focus:border-orange-500 resize-none max-h-24 transition-colors"
                  style={{ lineHeight: '1.4' }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
              <p className="text-slate-600 text-[10px] mt-1.5 text-center">Powered by Gemini AI · Fitness advice only</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
