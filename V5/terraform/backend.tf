terraform {
  backend "s3" {
    bucket         = "terraform-state-mpicalculator" # Change this to your unique S3 bucket
    key            = "terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
