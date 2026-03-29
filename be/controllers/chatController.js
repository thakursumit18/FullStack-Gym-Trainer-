const https = require('https');

const GEMINI_MODEL = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are FitBot — a friendly, knowledgeable AI fitness assistant inside GymTrainer app.

YOUR PERSONALITY:
- Talk like a real gym buddy — warm, encouraging, casual but accurate
- Mix English and Hinglish naturally (e.g., "Bhai, ye exercise bahut effective hai!", "Kal se start kar yaar!")
- Use emojis occasionally to keep it fun 💪🔥
- Never be robotic or overly formal
- Be motivating but honest — don't give false hope

YOUR EXPERTISE — answer accurately on:
1. WORKOUTS: Exercise form, muscle groups, sets/reps, workout splits, progressive overload, rest days, warm-up/cool-down
2. DIET & NUTRITION: Macros (protein/carbs/fat), calories, Indian food options, meal timing, supplements (whey, creatine, etc.), hydration
3. BODY COMPOSITION: BMI, body fat %, muscle gain, fat loss, body recomposition
4. FITNESS GOALS: Bulking, cutting, maintaining, weight loss, strength training, cardio
5. RECOVERY: Sleep, muscle soreness (DOMS), stretching, foam rolling, injury prevention
6. BEGINNER GUIDANCE: How to start gym, basic exercises, common mistakes to avoid
7. MOTIVATION: Consistency tips, plateau breaking, mental fitness

IMPORTANT RULES:
- Always give practical, actionable advice
- For serious injuries or medical conditions, say "Bhai, doctor se milna zaroori hai"
- Keep responses concise — 3-5 sentences max unless detail is needed
- If asked something outside fitness/health, politely redirect: "Yaar, main sirf fitness ke baare mein help kar sakta hoon 😄"
- Never recommend steroids or harmful substances
- Always personalize if user data is provided

LANGUAGE STYLE EXAMPLES:
- "Bhai, bench press ke liye shoulder blades retract karo — bahut farak padega!"
- "Protein intake thoda badhao yaar, 1.6-2g per kg body weight aim karo 💪"
- "Rest day lena bhi training ka part hai — muscles tab grow karte hain!"
- "Kal se start kar, consistency hi key hai bro 🔥"`;

function callGemini(contents) {
  return new Promise((resolve, reject) => {
    const key = process.env.GEMINI_API_KEY;
    const body = JSON.stringify({ contents });
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1/models/${GEMINI_MODEL}:generateContent?key=${key}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(`${json.error.code}: ${json.error.message}`));
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) return reject(new Error('Empty response from Gemini'));
          resolve(text);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const chat = async (req, res) => {
  const { message, history = [], userContext } = req.body;
  if (!message?.trim()) return res.status(400).json({ message: 'Message is required' });

  try {
    let contextStr = '';
    if (userContext) {
      const { name, age, weight, height, goal, bodyType } = userContext;
      contextStr = `\n\nUSER PROFILE: Name: ${name || 'User'}, Age: ${age || 'unknown'}, Weight: ${weight || 'unknown'}kg, Height: ${height || 'unknown'}cm, Goal: ${goal || 'unknown'}, Body Type: ${bodyType || 'unknown'}. Personalize your response using this.`;
    }

    // Build contents array — must alternate user/model
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT + contextStr }] },
      { role: 'model', parts: [{ text: 'Got it! Main FitBot hoon — tera personal fitness buddy. Kya poochna hai? 💪' }] },
    ];

    // Add valid alternating history pairs
    for (let i = 0; i < history.length - 1; i += 2) {
      if (history[i]?.role === 'user' && history[i + 1]?.role === 'assistant') {
        contents.push({ role: 'user', parts: [{ text: history[i].content }] });
        contents.push({ role: 'model', parts: [{ text: history[i + 1].content }] });
      }
    }

    // Add current message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const reply = await callGemini(contents);
    res.json({ reply });

  } catch (err) {
    console.error('Gemini error:', err.message);
    const msg = err.message || '';
    if (msg.includes('429')) return res.status(429).json({ message: 'API quota exceeded. Try again in a moment!' });
    if (msg.includes('API_KEY') || msg.includes('API key')) return res.status(500).json({ message: 'AI service not configured.' });
    res.status(500).json({ message: `AI error: ${msg.slice(0, 100)}` });
  }
};

module.exports = { chat };
