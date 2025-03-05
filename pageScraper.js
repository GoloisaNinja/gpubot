import fs from 'fs';
const pageScraper = async (browser) => {
	const url = 'https://www.newegg.com/p/pl?d=rtx+4070ti&Order=1';
	const xtUrl = "https://www.newegg.com/p/pl?d=7900+xt&Order=1";
	const n70xt = "https://www.newegg.com/p/pl?d=rx+9070+xt&Order=1";
	const sapphireUrl = "https://www.newegg.com/p/pl?d=sapphire+pure+rx+9070+xt&Order=1";
	const asRockUrl = "https://www.newegg.com/p/pl?d=asrock+rx+9070+xt&Order=1";
	let logheader = false;
	
	const elementExists = async (selector) => {
		const element = await page.$(selector);
		if (element) {
			return true;
		}
		return false;
	};
	const waitForElements =  async(page) => {
		await page.waitForSelector('.item-features', { visible: true });
		await page.waitForSelector(
			'div.item-action > ul.price > li.price-current > strong',
			{ visible: true }
		);
		await page.waitForSelector('.item-title', { visible: true });
	}
	
	const scrapeCards = async () => {
		let cardHash = {};
		const cells = await page.$$eval('.item-cell', (cell) => {
			return cell.map((data) => {
				let promo = data.querySelector('.item-promo');
				let lowerConstraint = '499.99';
				let upperConstraint = '750.00';
				let price = data
					.querySelector('.price-current')
					.textContent.match(/\d*,*\d+.\d{2}/g)[0]
					.replace(',', '');
				if (promo) {
					if (promo.textContent === 'OUT OF STOCK') {
						return null;
					}
				}
				if ((parseFloat(price) < parseFloat(lowerConstraint)) || (parseFloat(price) > parseFloat(upperConstraint))) {
					return null;
				}
				return {
					model: data.querySelector('.item-features').textContent,
					title: data.querySelector('.item-title').textContent,
					price: price,
				};
			});
		});
		return cells;
	};


	const processCards = (scrapedCards) => {
		const comparePrices = (a, b) => {
			if (parseInt(a.price) > parseInt(b.price)) return 1;
			if (parseInt(a.price) < parseInt(b.price)) return -1;
			return 0;
		};
		let cards = scrapedCards.filter((card) => card !== null);
		cards.sort(comparePrices);
		let data = 'Bot Run Date: ' + new Date().toString() + '\n\n';
		if (cards.length && !logheader) {
			logheader = true;
			fs.writeFile('cards.txt', data, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
		for (let i = 0; i < cards.length; i++) {
			let subKeys = Object.keys(cards[i]);
			let data = '';
			for (let j = 0; j < subKeys.length; j++) {
				let subKey = subKeys[j];
				let lineEnd = '\n';
				subKey === 'price' && (lineEnd = '\n\n');
				data += cards[i][subKey] + lineEnd;
			}
			fs.appendFile('cards.txt', data, 'utf8', function (err) {
				if (err) {
					console.log(err);
				}
			});
		}
	}

	let page = await browser.newPage();
	console.log(`navigating to ${url}`);
	await page.goto(url, { waitUntil: 'load' });
	await waitForElements(page);
	const allCards = await scrapeCards();
	processCards(allCards);

	await page.goto(xtUrl, { waitUntil: 'load' });
	console.log(`navigating to ${xtUrl}`);
	await waitForElements(page);
	const xtCards = await scrapeCards();
	processCards(xtCards);

	await page.goto(n70xt, { waitUntil: 'load' });
	console.log(`navigating to ${n70xt}`);
	await waitForElements(page);
	const n70Cards = await scrapeCards();
	processCards(n70Cards);

	await page.goto(sapphireUrl, { waitUntil: 'load' });
	console.log(`navigating to ${sapphireUrl}`);
	await waitForElements(page);
	const sapphireCards = await scrapeCards();
	processCards(sapphireCards);

	await page.goto(asRockUrl, { waitUntil: 'load' });
	console.log(`navigating to ${asRockUrl}`);
	await waitForElements(page);
	const asRockCards = await scrapeCards();
	processCards(asRockCards);
	
	/* ADD TO CART STUFF
	const hasProductBuyDiv = await elementExists('#ProductBuy');
	if (hasProductBuyDiv) {
		const addToCartExists = await elementExists(
			'#ProductBuy > div > div:nth-child(2) > button.btn'
		);
		if (addToCartExists) {
			await page.click('#ProductBuy > div > div:nth-child(2) > button.btn');
			await page.waitForSelector('.modal-footer');
			await page.click('.modal-footer > button:nth-child(1)');
			await page.waitForSelector('.item-actions');
			const [response] = await Promise.all([
				page.waitForNavigation(),
				page.click('.item-actions > button:nth-child(3)'),
			]);
			const data = 'PURCHASE SUCCESS';
			fs.writeFile('purchased.txt', data, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
				console.log('wrote to purchased...');
			});
		} else {
			const timestamp = Date.now();
			let data = `\nAttempted Purchase. Add to cart not available. Time: ${timestamp}`;
			fs.appendFile('log.txt', data, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
				console.log('wrote to log...');
			});
		}
	} */
};
export default pageScraper;
