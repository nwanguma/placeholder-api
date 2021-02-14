const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (name, email) => {
  return sgMail.send({
    to: email,
    from: "nwangumat@hotmail.com",
    subject: "Welcome to challenge.io",
    text: `Hello ${name}, welcome to sendGrid`,
  });
};

module.exports = sendWelcomeEmail;
