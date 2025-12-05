terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.47.0"

    }
  }
}

resource "random_string" "unique" {
  length      = 5
  min_numeric = 5
  numeric     = true
  special     = false
  lower       = true
  upper       = false
}


provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
subscription_id = "12ce2e00-9ed1-4fb6-8bfc-03b9bd0a200a"

}

resource "azurerm_resource_group" "PadelNotes-rg" {
  name     = "PadelNotes"
  location = "UK South"
}

resource "azurerm_storage_account" "functionapp-storageaccount" {
  name                     = "functionappsa01"
  resource_group_name      = azurerm_resource_group.PadelNotes-rg.name
  location                 = azurerm_resource_group.PadelNotes-rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "functionapp-serviceplan" {
  name                = "functionappserviceplan"
  resource_group_name = azurerm_resource_group.PadelNotes-rg.name
  location            = azurerm_resource_group.PadelNotes-rg.location
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_log_analytics_workspace" "log-workspace" {
  name                = "padelnotes-workspacelogs"
  location            = azurerm_resource_group.PadelNotes-rg.location
  resource_group_name = azurerm_resource_group.PadelNotes-rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "functionapp-appinsights" {
  name                = "functionapp-appinsights"
  location            = azurerm_resource_group.PadelNotes-rg.location
  resource_group_name = azurerm_resource_group.PadelNotes-rg.name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.log-workspace.id
}

resource "azurerm_cosmosdb_account" "PadelNotesCosmosDBAccount" {
  name                = "padelnotesdb"
  resource_group_name = azurerm_resource_group.PadelNotes-rg.name
  location            = azurerm_resource_group.PadelNotes-rg.location
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }
  geo_location {
    location          = "uksouth"
    failover_priority = 0
  }
  capabilities {
    name = "EnableServerless"
  }
}

resource "azurerm_cosmosdb_sql_database" "PadelNotesDB" {
  name                = "PadelNotesDB"
  resource_group_name = azurerm_resource_group.PadelNotes-rg.name
  account_name        = azurerm_cosmosdb_account.PadelNotesCosmosDBAccount.name
}

resource "azurerm_cosmosdb_sql_container" "PadelNotesContainerDB" {
  name                  = "ImportGame"
  resource_group_name   = azurerm_resource_group.PadelNotes-rg.name
  account_name          = azurerm_cosmosdb_account.PadelNotesCosmosDBAccount.name
  database_name         = azurerm_cosmosdb_sql_database.PadelNotesDB.name
  partition_key_paths   = ["/playerId"]
  partition_key_version = 1
}


resource "azurerm_cognitive_account" "ai_foundry" {
  name                = "PadelNotesAI${random_string.unique.result}"
  resource_group_name = azurerm_resource_group.PadelNotes-rg.name
  location            = azurerm_resource_group.PadelNotes-rg.location
  kind                = "AIServices"

  sku_name = "S0"

}

resource "azurerm_cognitive_deployment" "aifoundry_deployment_gpt_4o-mini" {
  depends_on = [
    azurerm_cognitive_account.ai_foundry
  ]
  name                 = "gpt-4o-mini"
  cognitive_account_id = azurerm_cognitive_account.ai_foundry.id

  sku {
    name     = "GlobalStandard"
    capacity = 1
  }

  model {
    format  = "OpenAI"
    name    = "gpt-4o-mini"
    version = "2024-07-18"
  }
}

resource "azurerm_linux_function_app" "functionapp" {
  name                = "padelnotes-function-app001"
  resource_group_name = azurerm_resource_group.PadelNotes-rg.name
  location            = azurerm_resource_group.PadelNotes-rg.location


  storage_account_name       = azurerm_storage_account.functionapp-storageaccount.name
  storage_account_access_key = azurerm_storage_account.functionapp-storageaccount.primary_access_key
  service_plan_id            = azurerm_service_plan.functionapp-serviceplan.id

  app_settings = {
    "APPINSIGHTS_CONNECTION_STRING"              = azurerm_application_insights.functionapp-appinsights.connection_string
    "APPINSIGHTS_KEY"                            = azurerm_application_insights.functionapp-appinsights.instrumentation_key
    "CosmosDBConnectionString"                   = azurerm_cosmosdb_account.PadelNotesCosmosDBAccount.primary_sql_connection_string
    "KEY" = azurerm_cosmosdb_account.PadelNotesCosmosDBAccount.primary_key
    "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"
    "OPANAI_KEY" = azurerm_cognitive_account.ai_foundry.primary_access_key
    "URL" = "https://padelnotesdb.documents.azure.com:443/"

  }

  site_config {
    application_stack {
      python_version = "3.12"
    }

    cors {
      allowed_origins = ["http://127.0.0.1:3000"]
    }
  }
}


