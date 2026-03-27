import { motion } from 'framer-motion';

function getMessage(entries, user) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayLog = entries.find(e => e.date === today);
  const yesterdayLog = entries.find(e => e.date === yesterday);
  const last7 = entries.filter(e => e.date >= new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]);
  const last7Done = last7.filter(e => e.workoutCompleted).length;
  const hour = new Date().getHours();

  if (entries.length === 0)
    return { text: `Welcome, ${user?.name?.split(' ')[0]}! Start your first workout today 💪`, color: 'blue', icon: '🚀' };

  if (todayLog?.workoutCompleted)
    return { text: "You crushed today's workout! Rest up and come back stronger 🏆", color: 'green', icon: '✅' };

  if (yesterdayLog && !yesterdayLog.workoutCompleted)
    return { text: "You skipped yesterday — no worries, let's get back on track 💪", color: 'orange', icon: '⚡' };

  if (last7Done >= 5)
    return { text: `Incredible consistency this week — ${last7Done}/7 days! You're unstoppable 🔥`, color: 'orange', icon: '🔥' };

  if (last7Done >= 3)
    return { text: `Good work this week — ${last7Done}/7 days done. Push for one more! 💪`, color: 'green', icon: '💪' };

  if (hour < 12)
    return { text: "Good morning! Start your day strong with today's workout 🌅", color: 'blue', icon: '🌅' };

  if (hour < 17)
    return { text: "Afternoon energy is peak energy — time to hit the gym! ⚡", color: 'orange', icon: '⚡' };

  return { text: "Evening workout? Let's go — consistency beats perfection 🌙", color: 'purple', icon: '🌙' };
}

const colorMap = {
  orange: 'from-orange-500/15 to-red-500/10 border-orange-500/30 text-orange-300',
  green: 'from-green-500/15 to-emerald-500/10 border-green-500/30 text-green-300',
  blue: 'from-blue-500/15 to-cyan-500/10 border-blue-500/30 text-blue-300',
  purple: 'from-purple-500/15 to-violet-500/10 border-purple-500/30 text-purple-300',
};

export default function SmartMessage({ entries, user }) {
  const msg = getMessage(entries, user);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-r ${colorMap[msg.color]} border rounded-xl px-5 py-3.5 flex items-center gap-3`}
    >
      <span className="text-xl">{msg.icon}</span>
      <p className="text-sm font-medium">{msg.text}</p>
    </motion.div>
  );
}
