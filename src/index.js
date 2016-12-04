const process = require('process');
const BotApi = require('node-telegram-bot-api');

const DB = require('./db');
const fetch = require('./fetch');

const db = new DB();

const token = process.env.TOKEN;
const params = {polling: true};

const startOpt = {
	reply_markup: JSON.stringify({
		keyboard: [[`select a city`], [`get prayer times`]],
		force_reply: true
	})
};

const forceReplyOpt = {
	reply_markup: JSON.stringify({
		force_reply: true
	})
};

const defualtKeybord = {
	reply_markup: JSON.stringify({
		keyboard: [[`get prayer times`], [`select a city`]]
	})
};

class Bot extends BotApi {
	constructor() {
		super(token, params);
		this.onText(/^\/start/, m => this.onStart(m));
		this.onText(/^(get prayer times)$/, m => this.handler(m));
		this.onText(/^(select a city)$/, m => this.getCity(m));
		this.onText(/^\/help$/, m => this.sendHelp(m));
	}
	sendHelp() {
	}
	onStart(m) {
		this.sendMessage(m.chat.id, `As-salāmu alaykum!`, startOpt);
	}
	handler(m) {
		db.getById(m.from.id, (err, repl) => this.catchRes(err, repl, m));
	}
	catchRes(err, repl, m) {
		if (err) {
			console.log('Что то случилось при чтении: ' + err);
		} else if (repl) {
			this.send(repl.city, m.chat.id);
		}
		else {
			this.sendMessage(m.from.id, `Sorry, try set your city again`);
		}
	}
	send(city, id) {
		fetch(city)
			.then(text => this.sendMessage(id, text))
			.catch(() => this.sendMessage(id, `Sorry, try set your city again`));
	}
	saveUser(m) {
		const { id, last_name, username, first_name } = m.from;
		db.save(`${id}`, {
			last_name,
			first_name,
			username,
			city: m.text
		});
	}
	saveUserSendKeybord(m) {
		this.saveUser(m);
		this.sendMessage(m.chat.id,
			`Ok, now you can get prayer time in ${m.text}.`, defualtKeybord);
	}
	replyToMessage(m) {
		this.onReplyToMessage(m.chat.id, m.message_id,
			(msg) => this.saveUserSendKeybord(msg));
	}
	getCity(m) {
		this.sendMessage(m.chat.id, `What's your city?`, forceReplyOpt)
			.then((s) => this.replyToMessage(s));
	}
}

new Bot();
