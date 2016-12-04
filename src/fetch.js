const fetch = require('isomorphic-fetch');
const KEY = process.env.KEY;

const getResult = (res) => {
	return Object.keys(res.items[0])
		.reduce((acc, el) => {
			if (el === 'date_for') {
				acc += `${res.title}\ndate: ${res.items[0][el]} \n------------\n`;
			} else {
				acc += `${el} - ${res.items[0][el]} \n`;
			}
			
			return acc;
		}, '');
};

module.exports = (city) => {
	return fetch(`http://muslimsalat.com/${encodeURI(city)}.json?key=${KEY}`)
		.then(res => res.json())
		.then(res => getResult(res))
};
