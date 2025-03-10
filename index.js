import startBrowser from './browser.js';
import scraperController from './pageController.js';
import sendMail from './mailer.js';
import fs from 'fs';
import readline from 'readline';

let alreadyPurchased = false;

async function readLines(filePath) {
	const fileStream = fs.createReadStream(filePath);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});
	for await (const line of rl) {
		rl.close(); // ONLY READ THE FIRST LINE - NOT THE CARD PURCHASE DETAILS
		if (line.includes('PURCHASE SUCCESS')) {
			alreadyPurchased = true;
		}
	}
}

await readLines('./purchased.txt')

if (!alreadyPurchased) {
	let browserInstance = startBrowser();
	await scraperController(browserInstance);
} else {
	console.log('you already bought a card bruh...')
}
/*
let cardsExist = false;
await scraperController(browserInstance);

async function readLines(filePath) {
	const fileStream = fs.createReadStream(filePath);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});
	for await (const line of rl) {
		if (line.includes('Bot Run Date')) {
			cardsExist = true;
		}
	}
}

try {
	await readLines('./cards.txt');
} catch (error) {
	console.log(error);
}
if (cardsExist) {
	sendMail();
} else {
	console.log('you really do not need more graphics cards meatbag...');
	fs.appendFile(
		'./log.txt',
		`Bot Ran - No Email Sent: ${new Date().toString()}\n`,
		(err) => {
			if (err) {
				console.error('error appending to log file');
			}
		}
	);
} */
