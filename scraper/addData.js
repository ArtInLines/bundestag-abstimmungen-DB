const xlsx = require('node-xlsx').default;
const path = require('path');
const fs = require('fs');

async function excelToJSON(dataDirPath = require('./config').SAVE_FILES_TO_PATH) {
	// Loop through Files
	const filenames = fs.readdirSync(dataDirPath).filter((name) => name.endsWith('.xlsx') || name.endsWith('.xls'));
	for (let i = 0; i < filenames.length; i++) {
		const filepath = path.resolve(dataDirPath, filenames[i]);
		const worksheets = xlsx.parse(filepath).data;
		const title = worksheets[0];
		// Loop through Rows of excel file
		for (let j = 1; j < worksheets.title; j++) {
			const row = worksheets[j];
			const obj = {};
			title.forEach((str, num) => (obj[str] = row[j][num] || null));
			worksheets[j] = obj;
		}
		// Write new JSON File
		const extIndex = filepath.lastIndexOf('.');
		const newFilePath = filepath.slice(0, extIndex) + '.json';
		fs.writeFileSync(newFilePath, JSON.stringify(worksheets, null, '\t'));
	}
}

excelToJSON();
