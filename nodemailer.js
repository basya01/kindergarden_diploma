import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
  {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'rocky.breitenberg58@ethereal.email',
      pass: 'JrrBKrpdV5P6ktea5w',
    },
  },
  {
    from: 'rocky.breitenberg58@ethereal.email',
  }
);

export const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log('Email sent: ', info);
  });
};
