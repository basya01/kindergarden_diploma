import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'zander.roob1@ethereal.email',
    pass: 'juJWgrA9BFNCab5w3D',
  },
});

export const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log('Email sent: ', info);
  });
};
