const path = require('path');

module.exports = {
	BASE_URL: 'https://www.bundestag.de',
	URL_PATH: '/parlament/plenum/abstimmung/liste',
	START_DATE: '24.10.2017',
	END_DATE: '26.9.2021',
	SAVE_FILES_TO_PATH: path.resolve(__dirname, 'data'),
	SAVE_BIG_FILE_TO_PATH: path.resolve(__dirname, 'all_data.csv'),
};
