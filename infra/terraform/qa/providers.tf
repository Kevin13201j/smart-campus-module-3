provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "smart-campus-uce"
      Module      = "module-3"
      Environment = "qa"
      ManagedBy   = "terraform"
    }
  }
}

