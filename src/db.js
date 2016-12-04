const redis = require('redis');
const bunyan = require('bunyan');
const process = require('process');

const port = process.env.DB_PORT;
const host = process.env.DB_HOST;

const client = redis.createClient(port, host);
const log = bunyan.createLogger({
	name: 'bot',
	streams: [{
		path: './db.log',
	}]
});

class DB {
	constructor() {
		client.on("error", (err) => log.info("Error: " + err));
	}
	save(id, val) {
		client.hmset(id, val, err => {
			if (err) {
				log.info('Что то случилось при записи: ' + err);
				client.quit();
			}
		});
	}
	getById(id, cb) {
		client.hgetall(`${id}`, cb)
	}
}

module.exports = DB;
