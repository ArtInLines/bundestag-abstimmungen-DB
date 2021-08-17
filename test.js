const xlsx = require('node-xlsx');
const fs = require('fs');

const worksheet1 = xlsx.parse('./data/59.xlsx')[0].data;
console.log(worksheet1.slice(700));
const t = worksheet1.slice(1).reduce((p, c) => p + '\n' + c.reduce((p, c) => p + ',' + c));
console.log(t);

/* const worksheet2 = xlsx.parse('./test.xlsx')[0].data;

const ws = fs.createWriteStream('./MyTest.csv');
ws.write(worksheet1.reduce((p, c) => p + '\n' + c.reduce((p, c) => p + ',' + c)));
ws.end('\n' + worksheet2.slice(1).reduce((p, c) => p + '\n' + c.reduce((p, c) => p + ',' + c))); */
