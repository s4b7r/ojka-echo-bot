Generate certificate and key with `openssl req -newkey rsa:2048 -sha256 -nodes -keyout YOURPRIVATE.key -x509 -days 365 -out YOURPUBLIC.pem -subj "/C=DE/O=OJKA Echo Bot/CN=elab-testing.s4b7r.de" -passout pass:KEYPHRASE`.

Base64 encode both with `base64 -w 0 YOURPUBLIC.pem`, `base64 -w 0 YOURPRIVATE.key` and copy their output into `.env`.

Copy your `KEYPHRASE` from OpenSSL command into `.env`.

Ideally start with `docker compose up -d --force-recreate` for development or make sure you remove the images of development builds.

