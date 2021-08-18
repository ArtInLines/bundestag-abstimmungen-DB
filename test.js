const xlsx = require('node-xlsx');
const fs = require('fs');

/* const worksheet1 = xlsx.parse('./data/59.xlsx')[0].data;
console.log(worksheet1.slice(700));
const t = worksheet1.slice(1).reduce((p, c) => p + '\n' + c.reduce((p, c) => p + ',' + c));
console.log(t);
 */
/* const worksheet2 = xlsx.parse('./test.xlsx')[0].data;

const ws = fs.createWriteStream('./MyTest.csv');
ws.write(worksheet1.reduce((p, c) => p + '\n' + c.reduce((p, c) => p + ',' + c)));
ws.end('\n' + worksheet2.slice(1).reduce((p, c) => p + '\n' + c.reduce((p, c) => p + ',' + c))); */

const csvToJSON = (readFromPath = './all_data.csv', writeToPath = './all_data.json') => {
	const csv = fs
		.readFileSync(readFromPath)
		.toString()
		.split('\n')
		.map((line) => line.split(','));
	const len = csv[0].length;
	for (let col = 0; col < csv.length; col++) {
		const line = csv[col];
		if (line.length > len) {
			const factor = line.length / len;
			for (let j = 1; j < factor; j++) csv.splice(col + j, 0, csv[col].splice(len, len));
		}
	}
	fs.writeFileSync(writeToPath, JSON.stringify(csv, null, '\t'));
};

const jsonToCSV = (readFromPath = './all_data.json', writeToPath = './all_data.csv') => {
	const table = JSON.parse(fs.readFileSync(readFromPath));
	// Alternatively:
	// fs.writeFileSync(writeToPath, table.reduce((p, c) => p + '\n' + c.reduce((p, c) => p + ',' + c)))
	const ws = fs.createWriteStream(writeToPath);
	for (let i = 0; i < table.length; i++) {
		let line = table[i].reduce((p, c) => p + ',' + c);
		if (i !== 0) line = '\n' + line;
		ws.write(line);
	}
	ws.close();
};

csvToJSON();
jsonToCSV();
