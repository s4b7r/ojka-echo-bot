# Telegram Echo Bot

## Local development

Make sure you remove the images of development builds to rebuild for the next iteration. Otherwise, you could be testing old versions of your source that are still in an old image.

If you have a server with SSH and exposed to the internet, you can use SSH remote port forwarding for testing with `ssh -R *:YOUR_REMOTE_PORT:127.0.0.1:CONTAINER_PORT USER@YOUR_SERVER`. `YOUR_REMOTE_PORT` must be one of the [ports allowed by Telegram.](https://core.telegram.org/bots/webhooks#the-short-version). `CONTAINER_PORT` is the port that is exposed by your container on your Docker host.

### Setup

1. Copy `.env.example` into `.env` and modify the values to your liking.
   1. Get your `BOT_TOKEN` from [the Telegram BotFather](https://telegram.me/BotFather).

## Setup self-signed certificates

1. Generate certificate and key with `openssl req -newkey rsa:2048 -sha256 -nodes -keyout YOURPRIVATE.key -x509 -days 365 -out YOURPUBLIC.pem -subj "/O=OJKA Echo Bot/CN=your.example.org" -passout pass:KEYPHRASE`. Make sure to replace `your.example.org` and `KEYPHRASE`.
2. Base64 encode both, the certificate and the key, with `base64 -w 0 YOURPUBLIC.pem` and `base64 -w 0 YOURPRIVATE.key` and copy the base64 output into `.env`. Copy your `KEYPHRASE` from OpenSSL command into `.env`.
3. `SSL_*_BASE64_PART{2/3}` can be used, if your can not set environment variables or secrets of the length of the encoded certificate and key.

## HTTPS via gateway

If the bot will be served behind a gateway that also provides the TLS certificate, the container must serve http instead of https. https will be available to Telegram via the gateway. To serve http, leave out all `SSL_KEY_*` environment variables. Only `BOT_TOKEN` and `BOT_SERVER_URL` are required then.

Please note, that currently it is assumed that the gateway serves a certificate that is signed by a [trusted certificate authority](https://core.telegram.org/bots/webhooks#a-verified-supported-certificate).

## Terraform

Using Scaleway.

### Credentials

1. Get your Access Key ID and Secret Key [for the Scaleway API](https://www.scaleway.com/en/docs/identity-and-access-management/iam/how-to/create-api-keys/).
2. Use one of the methods of [providing credentials](https://registry.terraform.io/providers/scaleway/scaleway/latest/docs#authentication).
   1. To set the credentials with environment variables...
      1. in PowerShell use 
         1. `env:SCW_ACCESS_KEY = "MyValue"` and
         2. `env:SCW_SECRET_KEY = "MyValue"`

### Setup

1. Copy `variables.tfvars.example` into `YOURNAME.tfvars` and modify the values to your liking.
   1. `container_namespace` and `container_name` can be left empty. The namespace will by default be named with a `dev`-part in it.
   2. `bot_server_url` must the URL to the webhook that will be available to Telegram. As Scaleway serverless container exposes 443 to the outside regardless of the port exposed by your container, the port must always be 443.
   3. Setup of custom domain is not yet supported automatically and must be [set up by hand](https://www.scaleway.com/en/docs/serverless/containers/how-to/add-a-custom-domain-to-a-container/). This must be done after the first creation of the container.
2. If you want multiple environments like prod and dev, use `terraform workspace new WORKSPACE_NAME` to create a new workspace. I suggest naming the `.tfvars` file specifically for this workspace.

If you have existing infrastructure, you can [import](https://developer.hashicorp.com/terraform/cli/commands/import) that resources into the Terraform state:

1. Find the ID of your existing container namespace:
   1. Go to Serverless > Containers
   2. Select the correct namespace
   3. Switch to "Namespace settings" tab
   4. Copy Namespace ID
2. Import using: `terraform import scaleway_container_namespace.main` NAMESPACE_ID
3. Find the ID of your existing container:
   1. From the namespace's container list select the correct container
   2. On the "Overview" tab copy Container ID
4. Import using: `terraform import scaleway_container.main` NAMESPACE_ID

### Exec

1. If you have multiple environments, make sure you have selected the correct Terraform workspace with `terraform workspace select WORKSPACE_NAME`.
2. `terraform plan -var-file=FILENAME.tfvars` to see Terraform's plan.
3. `terraform apply -var-file=FILENAME.tfvars` to apply the plan to your infrastructure.

## Testing

Setup your Python environment using the conda `environment.yml` or using the `requirements.txt`. For conda you can use `conda env create --file environment.yml` - it will create a new environment named `telegram`.

For testing fill in `test/.env` from `test/.env.example`. You will get your Telegram App API ID and Hash from [https://my.telegram.org/apps](https://my.telegram.org/apps). Get your session string by executing `test/setup_get_session_string.py` manually. Get your bot's name from Telegram.
