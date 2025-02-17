var express = require('express');
var http = require('http');
var https = require('https');
var needle = require('needle');
var fs = require('fs');
require('dotenv').config();

var app = express();
app.use(express.json());

const CERT_FILE = 'cert.pem';
const KEY_FILE = 'cert.key';

const telegram_bot_endpoint = 'https://api.telegram.org/bot' + process.env.BOT_TOKEN;

const PORT = process.env.PORT || 8443;
const HOST = '0.0.0.0';

/**
 * @example
 * POST: https://<SERVER_ADDRESS>:8443/?msg=hello%20world
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
const CERT_PART1 = process.env.SSL_CERT_BASE64 || ''; // Default to empty string if undefined
const CERT_PART2 = process.env.SSL_CERT_BASE64_PART2 || '';
const CERT_PART3 = process.env.SSL_CERT_BASE64_PART3 || '';
console.log('SSL Cert Base64 Part 1: ' + CERT_PART1);
console.log('SSL Cert Base64 Part 2: ' + CERT_PART2);
console.log('SSL Cert Base64 Part 3: ' + CERT_PART3);
const CERT_BASE64 = `${CERT_PART1}${CERT_PART2}${CERT_PART3}`;
console.log('SSL Cert Base64: ' + CERT_BASE64);
const decodedCertData = Buffer.from(CERT_BASE64, 'base64').toString('utf-8');
// Write the decoded data to the file
fs.writeFileSync(CERT_FILE, decodedCertData);
console.log('Written cert data:' + decodedCertData);

// Decode the Base64 string
const KEY_PART1 = process.env.SSL_KEY_BASE64 || ''; // Default to empty string if undefined
const KEY_PART2 = process.env.SSL_KEY_BASE64_PART2 || '';
const KEY_PART3 = process.env.SSL_KEY_BASE64_PART3 || '';
const KEY_BASE64 = `${KEY_PART1}${KEY_PART2}${KEY_PART3}`;
const decodedKeyData = Buffer.from(KEY_BASE64, 'base64').toString('utf-8');
// Write the decoded data to the file
fs.writeFileSync(KEY_FILE, decodedKeyData);
// console.log('Written key data:' + decodedKeyData);


needle('post', telegram_bot_endpoint + '/setWebhook', 
    {
        url: ''
    }
)
.catch(function(err) {
    console.error('Error:', err);
})
.then(function (res) {
    console.log('Last Telegram webhook unset.');
    console.log('Last Telegram webhook unset: Response:', res.body);

    var webhook_options = {};

    if (KEY_BASE64 != '') {
        webhook_options = { 
            url: process.env.BOT_SERVER_URL, 
            certificate: {
                file: CERT_FILE,
                content_type: 'application/x-pem-file'
            }
        };
    } else {
        webhook_options = { 
            url: process.env.BOT_SERVER_URL,  
        };
    }

    needle('post', telegram_bot_endpoint + '/setWebhook', webhook_options, { multipart: true })
    .catch((err) => {
        console.error('Error:', err);
    })
    .then((res) => {
        console.log('Telegeram webhook was set.');
        console.log('Telegram webhook set: Response:', res.body);
    });
});


var server;
if (KEY_BASE64 != '') {
    console.log('Using https');
    server = https.createServer({
            key: fs.readFileSync(KEY_FILE),
            cert: fs.readFileSync(CERT_FILE),
            passphrase: process.env.KEY_PASSPHRASE
        },
        app
    );
} else {
    console.log('Using http');
    server = http.createServer(app);
}

console.log('Starting the server now.')
server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
