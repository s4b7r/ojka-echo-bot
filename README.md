# Telegram Echo Bot

## Development

Make sure you remove the images of development builds to rebuild for the next iteration. Otherwise, you could be testing old versions of your source that are still in an old image.

If you have a server with SSH and exposed to the internet, you can use SSH remote port forwarding for testing with `ssh -R *:YOUR_REMOTE_PORT:127.0.0.1:CONTAINER_PORT USER@YOUR_SERVER`. `YOUR_REMOTE_PORT` must be one of the [ports allowed by Telegram.](https://core.telegram.org/bots/webhooks#the-short-version). `CONTAINER_PORT` is the port that is exposed by your container on your Docker host.

## Setup self-signed certificates

1. Generate certificate and key with `openssl req -newkey rsa:2048 -sha256 -nodes -keyout YOURPRIVATE.key -x509 -days 365 -out YOURPUBLIC.pem -subj "/O=OJKA Echo Bot/CN=your.example.org" -passout pass:KEYPHRASE`. Make sure to replace `your.example.org` and `KEYPHRASE`.
2. Base64 encode both, the certificate and the key, with `base64 -w 0 YOURPUBLIC.pem` and `base64 -w 0 YOURPRIVATE.key` and copy the base64 output into `.env`. Copy your `KEYPHRASE` from OpenSSL command into `.env`.

## HTTPS via gateway

If the bot will be served behind a gateway that also provides the TLS certificate, the container must serve http instead of https. https will be available to Telegram via the gateway. To serve http, leave out all SSL_KEY_* environment variables. Only `BOT_TOKEN` and `BOT_SERVER_URL` are required then.

Please note, that currently it is assumed that the gateway serves a certificate that is signed by a [trusted certificate authority](https://core.telegram.org/bots/webhooks#a-verified-supported-certificate).

