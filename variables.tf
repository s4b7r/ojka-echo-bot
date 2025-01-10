variable "scw_project_id" {
  description = "The Scaleway project id to use for infrastructure"
  type = string
  sensitive = true
}

variable "bot_server_url" {
  description = "The bot URL that will be announced to Telegram"
  type = string
}

# variable "bot_custom_domain" {
#   description = "Domain to attach for custom domain endpoint to the serverless container"
#   type = string
# }

variable "bot_token" {
  description = "The Telegram bot token"
  type = string
  sensitive = true
}

variable "container_namespace" {
  description = "Name of the serverless container namespace"
  type = string
  default = "bot-dev-ns"
}

variable "container_name" {
  description = "Name of the serverless container namespace"
  type = string
  default = "bot-container"
}
