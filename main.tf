terraform {
  required_providers {
    scaleway = {
      source = "scaleway/scaleway"
    }
  }
  required_version = ">= 0.13"
}

# https://registry.terraform.io/providers/scaleway/scaleway/latest/docs
provider "scaleway" {
  ## Please provide access key and secret key via the SCW_ACCESS_KEY, SCW_SECRET_KEY environment variables.
  ## E.g. in PowerShell by calling
  ##   $env:MyVariable = "MyValue"
  ##
  # access_key      = "<SCW_ACCESS_KEY>"
  # secret_key      = "<SCW_SECRET_KEY>"
  project_id	    = var.scw_project_id
  zone            = "fr-par-1"
  region          = "fr-par"
}

# https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/container_namespace
resource scaleway_container_namespace main {
  name = var.container_namespace
  description = "bot namespace"
}

# https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/container
resource scaleway_container main {
  name = var.container_name
  description = "bot container"
  namespace_id = scaleway_container_namespace.main.id
  registry_image = "ghcr.io/s4b7r/ojka-echo-bot:master"
  port = 8443
  cpu_limit = 100
  memory_limit = 128
  min_scale = 0
  max_scale = 1
  timeout = 300
  max_concurrency = 80
  privacy = "public"
  protocol = "http1"
  deploy = true

  environment_variables = {
    "BOT_SERVER_URL" = var.bot_server_url
  }

  secret_environment_variables = {
    "BOT_TOKEN" = var.bot_token
  }
}

# # https://registry.terraform.io/providers/scaleway/scaleway/latest/docs/resources/container_domain
# resource scaleway_container_domain "app" {
#   container_id = scaleway_container.main.id
#   hostname = var.bot_custom_domain
# }
