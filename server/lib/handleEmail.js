const textCreator = require('./textCreator');
const transporter = require('./nodeMailer-transporter');

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
