terraform {
  backend "s3" {
    bucket         = "smart-campus-uce-terraform-state"
    key            = "module-3/qa/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "smart-campus-uce-terraform-locks"
    encrypt        = true
  }
}

