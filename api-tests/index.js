const axios = require('axios').default;

// Create instances of Axios to access different APIs und databases
const mdbWatch = axios.create({ baseURL: 'https://www.abgeordnetenwatch.de/api/v2' }); // Abgeordneten Watch
const dip = axios.create({ baseURL: 'https://search.dip.bundestag.de/api/v1', params: { apikey: 'N64VhW8.yChkBUIJeosGojQ7CSR2xwLf3Qy7Apw464' } }); // Dokumentations- und Informationssystem für Parlamentsmaterialien

dip.get('person')
	.then((res) => console.log(res.data))
	.catch((err) => console.log(err.toJSON()));
