process.env = { ...process.env, ...require('./config') }; // Add configurations from `config.js` to `process.env`
const puppeteer = require('puppeteer');
const xlsx = require('node-xlsx');
// const https = require('https');
const fs = require('fs');
const path = require('path');

//
//
// Plan
// -->
// Loop through all pages, stopping at a specific date
// During each loop, collect name, date & link in an object and store it in a list
// Go through the list and download each file, naming the result according the date & name connected to the link
// Read all files, cutting off thefirst lineand piping all files together into one file.
// Possibly add the name of the poll into the data files
// -->
// Main Handler () --> void
//      Call all other functions
//      Possibly get input from command line arguments, with defaults hardcoded
// Get-Data-Handler (url, start-date, end-date) --> List of Links
//      Apply dates to the page
//      Call the next function for each page
//      After each call, click button to go to the next page and wait until the results are loaded
//      Add the results of each page together and return the resulting List
// Get data from page (htmlPage) --> Array<Object {name, date, link}>
//      Get the date, name and XLS file-link of all votes on the page via Cheerio
// Download a file (((name, ext, dir) / path), link) --> void
//      Download file via axios, enabling streaming
//      Pipe the resulting stream into a writeFileStream
// Pipe several XLS files into one ((readDirPath / List of FilePaths), writePath, cb, ...args) --> void
//      If readDirPath instead of FilePaths-List, create FilePaths-List, by getting all filepaths into a list
//      Loop through FilePaths-List and for each file, do the following:
//          Read the file & mutate it with cb(file, ...args)
//          Pipe the mutated file into the writeFileStream, which writes into writePath
//
//

async function main(checkNew = true) {
	const linksFPath = './links.json';
	let linksMap = new Map();
	if (checkNew || !fs.existsSync(linksFPath)) {
		linksMap = await getLinks();
		fs.writeFileSync(linksFPath, JSON.stringify(Array.from(links.values())));
	} else JSON.parse(fs.readFileSync(linksFPath)).forEach((obj) => linksMap.set(obj.link, obj));

	if (!fs.existsSync(process.env.SAVE_FILES_TO_PATH)) fs.mkdirSync(process.env.SAVE_FILES_TO_PATH);

	if (checkNew || fs.readdirSync(process.env.SAVE_FILES_TO_PATH).filter((name) => name.endsWith('.xlsx') || name.endsWith('.xls')).length < linksMap.size) {
		console.log('Downloading Files');
		const linksArr = Array.from(linksMap.values());
		for (let i = 0; i < linksArr.size; i++) {
			const obj = linksArr[i];
			await downloadFile(process.env.BASE_URL + obj.link, process.env.SAVE_FILES_TO_PATH, obj.text, obj.ftype);
		}
	}

	console.log('Writing Big File');
	await CSVFromXLSXFiles(
		process.env.SAVE_FILES_TO_PATH,
		process.env.SAVE_BIG_FILE_TO_PATH,
		null,
		transformWorksheet,
		linksMap
		/* (worksheet, i) => {
			for (let j = 0; j < worksheet.length; j++) {
				const row = worksheet[j];
				if (j === 0) row.push('Thema');
				else row.push(links[i].name);
			}
			i++;
			return worksheet;
		} */
	);
	console.log('Done');
}

/**
 *
 * @param {any[][]} worksheet Excel sheet
 * @param {String} fpath Filepath
 * @param {Map<String, {name: String, date: String, text: String, link: String, ftype: String}>} linksMap
 */
// TODO
function transformWorksheet(worksheet, fpath, linksMap) {
	// Wahl:
	//	0: ja
	//	1: nein
	//	2: Enthaltung
	//	3: ungültig
	//	4: nichtabgegeben
	const TITLES = [
		'Wahlperiode',
		'Sitzungnr',
		'Abstimmnr',
		'Fraktion/Gruppe',
		'Name',
		'Vorname',
		'Titel',
		['Wahl', 'ja', 'nein', 'Enthaltung', 'ungültig', 'nichtabgegeben'],
		'Bezeichnung',
		'Bemerkung',
	];

	const getVoteNum = (possibilities) => possibilities.reduce((pVal, cVal, i) => pVal + cVal * i);
	let voteIndices = [];

	worksheet.unshift().forEach((val, i) => TITLES);

	let titlesMap = new Map();
	TITLES.forEach((title, i) => {
		if (Array.isArray(title)) titlesMap.set(i, title);
	});
}

/**
 * Returns once the time is up. Async version of setTimeout(func, t), to prevent callback hell
 * @param {Number} t Time in ms
 */
async function wait(t) {
	return new Promise((resolve, reject) =>
		setTimeout(() => {
			console.log('Wait over');
			resolve();
		}, t)
	);
}

/**
 * Get all links for data in a specified time frame from `Bundestag.de`, by navigating the different pages and calling `getLinks()` on each page.
 * @param {String} url URL of the page, from which to retrieve the links from. Defaults to `process.env.BASE_URL + process.env.URL_PATH`. Since the function is hardcoded to work for `Bundestag.de`, `url` should not be changed.
 * @param {(Date | String)} startDate The earliest date, from which to get data from. If `typeof startDate === 'string'`, `startDate` must be in form of `DD.MM.YYYY`. Defaults to `process.env.START_DATE`
 * @param {(Date | String)} endDate The latest date, from which to get data from. If `typeof endDate === 'string'`, `endDate` must be in form of `DD.MM.YYYY`. Defaults to `process.env.END_DATE
 */
async function getLinks(url = process.env.BASE_URL + process.env.URL_PATH, startDate = process.env.START_DATE, endDate = process.env.END_DATE) {
	// Start up browser and go to page
	const browser = await puppeteer.launch({ headless: true });
	const page = await getPage(browser);
	await page.goto(url, { waitUntil: 'networkidle0' });
	// Set dates
	if (startDate && endDate) {
		startDate = getDateString(startDate);
		endDate = getDateString(endDate);
		const dateFields = await page.$$('input.bt-date-field');
		await dateFields.at(0).type(startDate);
		await dateFields.at(1).type(endDate);
		// Apply changes
		await page.keyboard.press('Enter');
		await wait(100);
	}
	// Helper Function
	async function getBtn(page) {
		let btn = await page.$('button.slick-next.slick-arrow');
		let btnDisabled = await btn.evaluate((btn) => btn.getAttribute('aria-disabled'));
		return { btn, btnDisabled };
	}
	// Get Links
	const links = new Map();
	let i = 0;
	let { btn, btnDisabled } = await getBtn(page);
	do {
		if (i !== 0) {
			await btn.click();
			await wait(1000);
			btn = await getBtn(page);
			btnDisabled = btn.btnDisabled;
			btn = btn.btn;
		}
		const elems = await page.$$('td[data-th=Dokument]');
		console.log(`Found ${elems.length} elements on this page`);
		for (let j = 0; j < elems.length; j++) {
			const el = elems[j];
			const text = await el.$eval('strong', (text) => text.textContent.trim().split('\n')[0]);
			const link = await el.$$eval('a.bt-link-dokument', (els) => els[1].getAttribute('href'));
			const ftype = await el.$$eval('a.bt-link-dokument', (els) => els[1].getAttribute('title').split(' ')[0].toLowerCase());
			const date = text.split(': ')[0];
			const name = text.split(': ').slice(1).join(': ');
			links.set(link, { date, name, link, text, ftype });
		}
		console.log({ i, linksLen: links.size });
		i++;
	} while (btn && btnDisabled === 'false');
	await browser.close();
	return links;
}

/**
 * Get the first page of a Browser instance. If the Browser has no pages open yet, open a new page.
 * @param {puppeteer.Browser} browser Browser instance
 * @returns {Promise<puppeteer.Page>}
 */
async function getPage(browser) {
	const pages = await browser.pages();
	if (pages.length > 0) return pages[0];
	else return browser.newPage();
}

/**
 * Transforms a Date instance into a Date-String of the format `DD.MM.YYYY`
 * @param {(String | Date)} date
 * @returns {String}
 */
function getDateString(date) {
	if (date instanceof Date) return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
	else return date;
}

/**
 * Download a file via a URL.
 * @param {String} link URL download-link
 * @param {String} saveTo The full path of the file. If `name` is inputted, `saveTo` is treated as the path to the directory.
 * @param {?String} name The name of the file, into which the result of calling `link` gets written. Defaults to `null`
 * @param {?String} ext Extension of the resulting file. If `ext` is inputted, it will be added to the full filepath independent of whether `name` is inputted too.
 */
async function downloadFile(link, saveTo, name = null, ext = null) {
	// Resolve the filepath
	if (name) saveTo = path.resolve(saveTo, name);
	if (ext) {
		ext = ext.toLowerCase();
		if (!ext.startsWith('.')) ext = '.' + ext;
		if (saveTo.endsWith('.')) saveTo = saveTo.slice(0, saveTo.length - 1);
		saveTo += ext;
	}
	// Download file
	const ws = fs.createWriteStream(saveTo);
	require('https').get(link, (res) => {
		res.pipe(ws);
		ws.on('finish', () => {
			ws.close();
		});
	});
	return new Promise((resolve, reject) => {
		ws.on('close', () => {
			resolve();
		});
		ws.on('error', (err) => {
			reject(err);
		});
	});
}

/**
 * Unite several Excel files into one big CSV file, containing all data. The data can be mutated via `cb()`. '.xls' and '.xlsx' files can both be read.
 * @param {Array<String> |  String} filePaths List of the paths of all files, to be united into one. Or the path to a directory, from which all XLS files will be taken together.
 * @param {String} writeToPath Path of the file, which is created by this function. The ".xlsx" extension will be added if necessary
 * @param {?String} title The first tilte line in the CSV file. If `!title`, then the title line of the first excel file will be used. Title lines from further excel files will only be excluded, if `!title`, otherwise they need to be excluded manually via `cb`
 * @param {?Function} cb Callback function, which will be called on every file, to mutate it, before writing it into `writeToPath`. Gets called as `cb(worksheet: Array, fpath: String, ...args)` Defaults to `null`
 * @param  {...any} args Additional arguments to pass into `cb`
 */
async function CSVFromXLSXFiles(filePaths, writeToPath, title = '', cb = null, ...args) {
	// Get filePathsList from directory-path
	if (typeof filePaths === 'string')
		filePaths = fs
			.readdirSync(filePaths)
			.filter((name) => name.endsWith('.xls') || name.endsWith('.xlsx'))
			.map((name) => path.resolve(filePaths, name));

	// Write CSV File
	const ws = fs.createWriteStream(writeToPath);
	for (let i = 0; i < filePaths.length; i++) {
		const fpath = filePaths[i];
		// console.log({ i, fpath });
		let worksheet = xlsx.parse(fpath)[0].data;
		if (typeof cb === 'function') worksheet = cb(worksheet, fpath, ...args);
		worksheet = worksheet.filter((col) => Array.isArray(col) && col.length > 0);

		// For debugging
		worksheet.forEach((col, index) => {
			if (col.length > 14) console.log({ col, fpath, index });
		});

		if (i === 0) ws.write(worksheetToCSVLines(worksheet));
		else ws.write(worksheetToCSVLines(worksheet.slice(1)));

		/* if (i === 0 && title) ws.write(title + '\n' + worksheetToCSVLines(worksheet));
		else if (i === 0) ws.write(worksheetToCSVLines(worksheet));
		else if (!title) ws.write('\n' + worksheetToCSVLines(worksheet.slice(1)));
		else ws.write('\n' + worksheetToCSVLines(worksheet)); */
	}

	// Return, once the file is written
	return new Promise((resolve, reject) => {
		ws.on('close', resolve);
		ws.on('error', (err) => reject(err));
	});
}

/**
 * Turns a worksheet from an excel file into a csv-file string.
 * @param {Array<Array>} worksheet
 * @return {String}
 */
function worksheetToCSVLines(worksheet) {
	if (typeof worksheet === 'string') return worksheet;
	return worksheet.reduce((p, c) => p + '\n' + c.reduce((p, c) => p + ',' + c));
}

main();
