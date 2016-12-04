const redis = require('redis');
const bunyan = require('bunyan');

const client = redis.createClient();
const log = bunyan.createLogger({
	name: 'bot',
	streams: [{
		path: './foo.log',
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
