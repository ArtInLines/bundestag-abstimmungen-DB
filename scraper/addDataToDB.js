const xlsx = require('node-xlsx').default;
const path = require('path');
const fs = require('fs');

async function main(dataDirPath = require('./config').SAVE_FILES_TO_PATH) {
	const filenames = fs.readdirSync(dataDirPath);
	for (let i = 0; i < filenames.length; i++) {
		const filepath = path.resolve(dataDirPath, filenames[i]);
		const worksheets = xlsx.parse(filepath).data;
		const title = worksheets[0];
		for (let j = 1; j < worksheets.title; j++) {
			const row = worksheets[i];
			
		}
	}
}

main();
