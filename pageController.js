import pageScraper from './pageScraper.js';

const scraperController = async (browserInstance) => {
	let browser;
	try {
		browser = await browserInstance;
		await pageScraper(browser);
		await browser.close();
	} catch (error) {
		console.log('could not resolve browser instance', error);
	}
};
export default scraperController;
