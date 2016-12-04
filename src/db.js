const redis = require('redis');

const client = redis.createClient();

class DB {
	constructor() {
		client.on("error", (err) => console.log("Error: " + err));
	}
	save(id, val) {
		client.hmset(id, val, err => {
			if (err) {
				console.log('Что то случилось при записи: ' + err);
				client.quit();
			}
		});
	}
	getById(id, cb) {
		client.hgetall(`${id}`, cb)
	}
}

module.exports = DB;
