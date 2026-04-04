const nodemailer = require('nodemailer');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('[GymTrainer] WARNING: EMAIL_USER or EMAIL_PASS not set in .env — OTP emails will fail.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify((err) => {
  if (err) console.error('[GymTrainer] Email transporter error:', err.message);
  else console.log('[GymTrainer] Email transporter ready ✅');
});

const sendOtpEmail = async (to, otp, name, subject = 'Your GymTrainer OTP') => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASS in .env');
  }
  await transporter.sendMail({
    from: `"GymTrainer 💪" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:16px;">
        <h2 style="color:#06b6d4;margin-bottom:8px;">💪 GymTrainer</h2>
        <h3 style="color:#ffffff;margin-bottom:16px;">${subject}</h3>
        <p style="color:#94a3b8;">Hey ${name},</p>
        <p style="color:#94a3b8;">Use the OTP below. It expires in <strong style="color:#06b6d4;">10 minutes</strong>.</p>
        <div style="background:#1e293b;border:2px solid #06b6d4;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
          <span style="font-size:36px;font-weight:900;letter-spacing:12px;color:#06b6d4;">${otp}</span>
        </div>
        <p style="color:#64748b;font-size:12px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
