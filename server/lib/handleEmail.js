const textCreator = require('./textCreator');
const nodemailer = require('nodemailer');
// const transporter = require('./nodeMailer-transporter');

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

async function handleEmail(flightInfo) {
  const contactList = flightInfo.json_agg;
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i];
    const messageBody = textCreator(flightInfo, contact);
    const msg = {
      from: process.env.EMAIL_USER,
      to: contact.email,
      subject: flightInfo.subject,
      text: messageBody
    };
    await transporter.sendMail(msg).catch(error => {
      console.error(error);
    });
  }
}

module.exports = handleEmail;
