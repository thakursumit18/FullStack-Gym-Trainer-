const https = require('https');

/**
 * Send OTP SMS via Fast2SMS v3 API
 * Free tier — works for Indian numbers without DLT registration
 * Get API key: https://www.fast2sms.com/dashboard/credentials
 */
const sendOtpSms = (phone, otp) => {
  return new Promise((resolve, reject) => {
    if (!process.env.FAST2SMS_API_KEY) {
      return reject(new Error('FAST2SMS_API_KEY not set in .env'));
    }

    // Fast2SMS v3 OTP endpoint — GET request with query params
    const params = new URLSearchParams({
      authorization: process.env.FAST2SMS_API_KEY,
      variables_values: otp,
      route: 'otp',
      numbers: phone,
    });

    const options = {
      hostname: 'www.fast2sms.com',
      path: `/dev/bulkV2?${params.toString()}`,
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('[Fast2SMS Response]', JSON.stringify(parsed));
          if (parsed.return === true) {
            console.log(`[GymTrainer] SMS sent to ${phone} ✅`);
            resolve(parsed);
          } else {
            const errMsg = Array.isArray(parsed.message)
              ? parsed.message.join(', ')
              : (parsed.message || JSON.stringify(parsed));
            reject(new Error(errMsg));
          }
        } catch {
          console.error('[Fast2SMS] Raw response:', data);
          reject(new Error('Invalid response from Fast2SMS'));
        }
      });
    });

    req.on('error', (err) => {
      console.error('[Fast2SMS] Request error:', err.message);
      reject(err);
    });

    req.end();
  });
};

module.exports = { sendOtpSms };
