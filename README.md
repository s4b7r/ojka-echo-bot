Generate certificate and key with `openssl req -newkey rsa:2048 -sha256 -nodes -keyout YOURPRIVATE.key -x509 -days 365 -out YOURPUBLIC.pem -subj "/O=OJKA Echo Bot/CN=your.example.org" -passout pass:KEYPHRASE`.

Base64 encode both with `base64 -w 0 YOURPUBLIC.pem`, `base64 -w 0 YOURPRIVATE.key` and copy their output into `.env`.

Copy your `KEYPHRASE` from OpenSSL command into `.env`.

Ideally start with `docker compose up -d --force-recreate` for development or make sure you remove the images of development builds.

If you have a server with SSH and exposed to the internet, you can use SSH remote port forwarding for testing with `ssh -R *:8443:127.0.0.1:8443 USER@YOUR_SERVER`.

