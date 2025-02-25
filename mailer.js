import nodemailer from 'nodemailer';
import fs from 'fs';

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.AUTHUSER,
		pass: process.env.AUTHPASS,
	},
});
const mailOptions = {
	from: process.env.MAILFROM,
	to: process.env.MAILTO,
	subject: 'GPUBOT found cards',
	text: 'Please see the attached text file for the cards meeting your criteria meat bag.',
	attachments: [
		{
			filename: 'cards.txt',
			path: './cards.txt',
		},
	],
};
const sendMail = () => {
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('error sending email');
		} else {
			console.log('mail sent!');
			fs.writeFile('./cards.txt', '', (err) => {
				if (err) {
					console.error('error emptying cards file');
				}
			});
			fs.appendFile(
				'./log.txt',
				`Email Sent: ${new Date().toString()}\n`,
				(err) => {
					if (err) {
						console.error('error appending to log file');
					}
				}
			);
		}
	});
};

export default sendMail;
