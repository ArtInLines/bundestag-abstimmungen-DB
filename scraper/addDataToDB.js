const xlsx = require('node-xlsx').default;
const path = require('path');
const fs = require('fs');

async function main(dataDirPath = require('./config').SAVE_FILES_TO_PATH) {
	const filenames = fs.readdirSync(dataDirPath);
	console.log({ filenames });
	for (let i = 0; i < filenames.length; i++) {
		const filepath = path.resolve(dataDirPath, filenames[i]);
		const worksheets = xlsx.parse(filepath);
		console.log(worksheets);
		process.exit(1);
	}
}

main();
