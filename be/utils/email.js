const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp, name) => {
  await transporter.sendMail({
    from: `"GymTrainer 💪" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your GymTrainer Password Reset OTP',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:16px;">
        <h2 style="color:#f97316;margin-bottom:8px;">💪 GymTrainer</h2>
        <h3 style="color:#ffffff;margin-bottom:16px;">Password Reset OTP</h3>
        <p style="color:#94a3b8;">Hey ${name},</p>
        <p style="color:#94a3b8;">Use the OTP below to reset your password. It expires in <strong style="color:#f97316;">10 minutes</strong>.</p>
        <div style="background:#1e293b;border:2px solid #f97316;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
          <span style="font-size:36px;font-weight:900;letter-spacing:12px;color:#f97316;">${otp}</span>
        </div>
        <p style="color:#64748b;font-size:12px;">If you didn't request this, ignore this email. Your password won't change.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
