var express = require('express');
var https = require('https');
var needle = require('needle');
var fs = require('fs');
require('dotenv').config();

var app = express();
app.use(express.json());

/**
 * @example
 * 	GET: https://<SERVER_ADDRESS>:8443/?msg=hello%20world
 */
app.post('/', (req, res) => {
	console.log(req.body);
	var chat_id = req.body.message.chat.id;
	res.sendStatus(200);

	needle.post('https://api.telegram.org/bot' + process.env.BOT_TOKEN + '/sendMessage', {
		'chat_id': chat_id,
		'text': req.body.message.text
	});

	needle('get', 'https://api.mcsrvstat.us/2/' + process.env.MC_SERVER_ADDRESS)
		.then((response) => {
			if(response.body.online == true) {
				needle.post('https://api.telegram.org/bot' + process.env.BOT_TOKEN + '/sendMessage', {
					'chat_id': chat_id,
					'text': 'And by the way: Our minecraft server is online with ' +
							response.body.players.online +
							' of max. ' +
							response.body.players.max +
							' players.'
				});
			}
		});
});

https.createServer({
	key: fs.readFileSync('./ojka-echo-bot.key'),
	cert: fs.readFileSync('./ojka-echo-bot.cert'),
	passphrase: process.env.KEY_PASSPHRASE
}, app).listen(8443);
