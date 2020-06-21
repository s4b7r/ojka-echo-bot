var express = require('express');
var https = require('https');
var fs = require('fs');
require('dotenv').config();

var app = express();

/**
 * @example
 * 	GET: https://<SERVER_ADDRESS>:8443/?msg=hello%20world
 */
app.get('/', function(req, res) {
	console.log('get-req /');
	if(req.query.msg) {
		res.send(req.query.msg);
	} else {
		res.send('hello world');
	}
});

https.createServer({
	key: fs.readFileSync('./ojka-echo-bot.key'),
	cert: fs.readFileSync('./ojka-echo-bot.cert'),
	passphrase: process.env.KEY_PASSPHRASE
}, app).listen(8443);
