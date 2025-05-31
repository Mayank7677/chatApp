const nodemailer = require("nodemailer");

const mail = process.env.OTP_MAIL;
const pass = process.env.OTP_PASS;
console.log(mail, pass);

// Setup the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mail,
    pass: pass,
  },
});

const sentOtpEmail = async (to, otp, name) => {
    console.log(to, otp, name);
    console.log("mail", mail, pass);
    console.log("-------------------------------------------");

  try {
    await transporter.sendMail({
      from: mail,
      to: to, 
      subject: "Your OTP for Account Verification",
      text: `Hello ${name} , Your OTP for account verification is: ${otp}. It will expire in 10 minutes.`,
      html: `<h1>Hello ${name} , Your OTP for account verification is: ${otp}. It will expire in 10 minutes.</h1>`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = sentOtpEmail;
