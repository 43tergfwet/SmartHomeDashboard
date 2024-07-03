const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL_USER, EMAIL_PASS, ALERT_EMAIL } = process.env;

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

function armSystem() {
  console.log("Arming the security system...");
}

function disarmSystem() {
  console.log("Disarming the security system...");
}

function monitorCameras() {
  console.log("Monitoring security cameras...");
  setTimeout(() => {
    const message = "Intruder detected!";
    console.log(message);
    sendAlert(message);
  }, 10000); 
}

function sendAlert(message) {
  let mailOptions = {
    from: EMAIL_USER,
    to: ALERT_EMAIL,
    subject: 'Smart Home Dashboard Alert',
    text: message
  };

  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function init() {
  armSystem();
  monitorCameras();
}

init();