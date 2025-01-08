var express = require('express');
var https = require('https');
var needle = require('needle');
var fs = require('fs');
require('dotenv').config();

var app = express();
app.use(express.json());

const CERT_FILE = 'cert.pem';
const KEY_FILE = 'cert.key';

const telegram_bot_endpoint = 'https://api.telegram.org/bot' + process.env.BOT_TOKEN;

/**
 * @example
 * 	GET: https://<SERVER_ADDRESS>:8443/?msg=hello%20world
 */
app.post('/', (req, res) => {
	console.log(req.body);
	var chat_id = req.body.message.chat.id;
	res.sendStatus(200);

	needle.post(telegram_bot_endpoint + '/sendMessage', {
		'chat_id': chat_id,
		'text': req.body.message.text
	});
});


// Decode the Base64 string
const decodedCertData = Buffer.from(process.env.SSL_CERT_BASE64, 'base64').toString('utf-8');
// Write the decoded data to the file
fs.writeFileSync(CERT_FILE, decodedCertData);
console.log('Written cert data:' + decodedCertData);

// Decode the Base64 string
console.log('SSL Key Base64: ' + process.env.SSL_KEY_BASE64);
const decodedKeyData = Buffer.from(process.env.SSL_KEY_BASE64, 'base64').toString('utf-8');
// Write the decoded data to the file
fs.writeFileSync(KEY_FILE, decodedKeyData);
console.log('Written key data:' + decodedKeyData);


needle('post', telegram_bot_endpoint + '/setWebhook', {
	url: ''
})
.catch(function(err) {
		console.error('Error:', err);
	})
.then(function (res) {
		console.log('Last Telegram webhook unset.');
		console.log('Last Telegram webhook unset: Response:', res.body);

		needle('post', telegram_bot_endpoint + '/setWebhook', { 
			url: process.env.BOT_SERVER_URL, 
			certificate: {
				file: CERT_FILE,
				content_type: 'application/x-pem-file'
			} 
		}, { multipart: true })
		.catch((err) =>{
			console.error('Error:', err);
		  })
		  .then((res)=>{
			console.log('Telegeram webhook was set.');
			console.log('Telegram webhook set: Response:', res.body);
		  
		});
	});




console.log('Starting the server now.')

https.createServer({
	key: fs.readFileSync(KEY_FILE),
	cert: fs.readFileSync(CERT_FILE),
	passphrase: process.env.KEY_PASSPHRASE
}, app).listen(process.env.PORT);
