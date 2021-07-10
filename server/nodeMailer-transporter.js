const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp-mail.outlook.com',
  secureConnection: false,
  maxConnections: 1,
  port: 587,
  secure: false,
  tls: { ciphers: 'SSLv3' },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = transporter;
