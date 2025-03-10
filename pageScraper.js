import fs from 'fs';
const pageScraper = async (browser) => {
	// lINE 205 CONTAINS THE FINAL BUY BOT CLICK - ONLY UNCOMMENT IF YOU WANT A BOT TO BUY YOU A CARD!
	/* TEST URLS 
	const url = 'https://www.newegg.com/p/pl?d=rtx+4070ti&Order=1';
	const xtUrl = "https://www.newegg.com/p/pl?d=7900+xt&Order=1";
	const n70xt = "https://www.newegg.com/p/pl?d=rx+9070+xt&Order=1";
	const sapphireUrl = "https://www.newegg.com/p/pl?d=sapphire+pure+rx+9070+xt&Order=1";
	const asRockUrl = "https://www.newegg.com/p/pl?d=asrock+rx+9070+xt&Order=1";
	// CARDS.TXT HEADER
	let logheader = false;
	*/
	const baseUrl = 'https://www.newegg.com';
	// SPECIFIC/DESIRED CARD URL
	//const testCardUrl = 'https://www.newegg.com/peladn-rx-580/p/27N-008H-00024';
	const cardUrl = 'https://www.newegg.com/gigabyte-gv-r9070xtgaming-16gd-amd-radeon-rx-9070-xt-16gb-gddr6/p/N82E16814932783?Item=N82E16814932783'
	const backupCardUrl = 'https://www.newegg.com/xfx-swift-rx-97tswf3w9-amd-radeon-rx-9070-xt-16gb-gddr6/p/N82E16814150907?Item=N82E16814150907'
	// BOOLEAN GLOBAL PURCHASE SUCCESS VAR
	let success = false;
	// BOOLEAN ELEMENT RETURN FUNC
	const elementExists = async (selector) => {
		const element = await page.$(selector);
		if (element) {
			return true;
		}
		return false;
	};
	/* LOGGING CARDS FOR EMAILS SECTION - NO PURCHASE LOGIC
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

	*/

	// PURCHASING LOGIC SECTION - CAUTION!! WILL PURCHASE CARDS AUTOMATICALLY

	let page = await browser.newPage();
	console.log(`navigating to ${baseUrl}`);
	await page.goto(baseUrl, { waitUntil: 'load' });
	// BEHOLD - THE LOGIN PROCESS...
	const loginBtn = await elementExists('.header2021-account')
	if (loginBtn) {
		const [response] = await Promise.all([
			page.waitForNavigation(),
			page.click('.header2021-account > a'),
		]);
		await page.waitForSelector('#labeled-input-signEmail');
		await page.type('#labeled-input-signEmail', process.env.NEWEGGEMAIL);
		await page.click('#signInSubmit');
		await page.waitForSelector('#labeled-input-password');
		await page.type('#labeled-input-password', process.env.NEWEGGPASS)
		const [presponse] = await Promise.all([
			page.waitForNavigation(),
			page.click('#signInSubmit'),
		]);
	}
	// PURCHASING LOGIC FOR CARD URLS...
	const attemptPurchase = async (url) => {
		// AWAIT NAV TO CARD URL
		await page.goto(url, { waitUntil: 'load' });
		console.log(`navigating to ${url}`);
		//await waitForElements(page);
		// DOES THE PAGE HAVE A BUY BUTTON
		const hasProductBuyDiv = await elementExists('#ProductBuy');
		if (hasProductBuyDiv) {
			const addToCartExists = await elementExists(
				'#ProductBuy > div > div:nth-child(2) > button.btn'
			);
			// DOES THE PAGE HAVE A ADD TO CART BUTTON
			if (addToCartExists) {
				let cardTitle = await page.$eval('.product-title', (title) => title.textContent);
				await page.click('#ProductBuy > div > div:nth-child(2) > button.btn');
				// MANAGE NEWEGG GARBAGE POPUPS FOR ADD ONS AND PROCEED TO CART
				await page.waitForSelector('.modal-footer');
				await page.click('.modal-footer > button:nth-child(1)');
				await page.waitForSelector('.item-actions');
				const [response] = await Promise.all([
					page.waitForNavigation(),
					page.click('.item-actions > button:nth-child(3)'),
				]);
				// SHOULD BE ON CHECKOUT PAGE
				await page.waitForSelector('.checkout-step-action-edit');
				// CHOOSE DEFAULT CARD METHOD OVER PAYPAL
				await page.click('.checkout-step-action-edit');
				// ENTER CVV
				await page.waitForSelector('.mask-cvv-4');
				await page.type('.mask-cvv-4', process.env.CVV);
				await page.click('.checkout-step-action-done')
				// DETERMINE IF NEWEGG HAS FULL CARD ENTRY SECURITY CHECK - IF SO, DEAL WITH IT
				const securityCheck = await elementExists('.mask-cardnumber');
				if (securityCheck) {
					await page.type('.mask-cardnumber', process.env.CARDNUMBER)
					await page.click('.modal-footer > .button-m')
				}
				// MAX I'M WILLING TO SPEND
				let upperContraint = "660.00"
				let cartTotal = await page.$eval('.summary-content-total > span > strong', (el) => el.textContent);
				console.log(cartTotal)
				let placeOrderBtnText = await page.$eval('#btnCreditCard', (btn) => btn.textContent)
				console.log(placeOrderBtnText)
				// MAKE SURE TOTAL IS SENSICAL AND THAT PLAVE ORDER BUTTON EXISTS
				if (placeOrderBtnText === 'Place Order' && parseFloat(upperContraint) > parseFloat(cartTotal)) {
					console.log('order is below contraint and the place order button exists...PURCHASING!!')
					// ****COMMENT THIS OUT DURING TESTING!! THIS WILL PLACE THE ORDER!!****
					await page.click('#btnCreditCard') // COMMENT THIS OUT TO AVOID PURCHASE!!!
					success = true
					const data = 'PURCHASE SUCCESS\nCard: ' + cardTitle + '\nPrice: ' + cartTotal;
					fs.writeFile('purchased.txt', data, 'utf8', function (err) {
						if (err) {
							return console.log(err);
						}
						console.log('wrote to purchased...card acquired!');
					});
				} else {
					const timestamp = Date.now();
					let data = `\nAttempted Purchase. Constraint or Place Order not met. Time: ${timestamp}`;
					fs.appendFile('log.txt', data, 'utf8', function (err) {
						if (err) {
							return console.log(err);
						}
					});

				}
			} else {
				const timestamp = Date.now();
				let data = `\nAttempted Purchase. Could not add to cart - likely out of stock. Time: ${timestamp}`;
				fs.appendFile('log.txt', data, 'utf8', function (err) {
					if (err) {
						return console.log(err);
					}
				});
			}
		} else {
			const timestamp = Date.now();
			let data = `\nAttempted Purchase. Check card page - no buy divs on page. Time: ${timestamp}`;
			fs.appendFile('log.txt', data, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
	}
	// FIRST CHOICE CARD
	await attemptPurchase(cardUrl)
	/* TESTING AWAITING SUCCESS - SHOULD ABORT SECOND RUN IF FIRST RUN GETS CARD
	if (!success) {
		await attemptPurchase(testCardUrl);
	} */
	// BACKUP CARD IF FIRST CHOICE NO WORKEY
	if (!success) {
		await attemptPurchase(backupCardUrl);
	}
	
};
export default pageScraper;
