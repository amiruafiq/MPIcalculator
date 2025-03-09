provider "aws" {
  region = var.aws_region
}

# =======================
# AWS SECRETS MANAGER
# =======================
resource "aws_secretsmanager_secret" "rds_credentials" {
  name = "aws-pricing-db-credentials"
  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "rds_credentials_version" {
  secret_id     = aws_secretsmanager_secret.rds_credentials.id
  secret_string = jsonencode({
    username = var.rds_username,
    password = var.rds_password
  })
}

# =======================
# RDS DATABASE (MySQL)
# =======================
resource "aws_db_instance" "aws_pricing_db" {
  identifier            = "aws-pricing-db"
  engine               = "mysql"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  db_name              = "aws_pricing"
  username            = jsondecode(aws_secretsmanager_secret_version.rds_credentials_version.secret_string)["username"]
  password            = jsondecode(aws_secretsmanager_secret_version.rds_credentials_version.secret_string)["password"]
  publicly_accessible = false
  skip_final_snapshot = true
  tags = var.tags
}

# =======================
# S3 BUCKET FOR CSV
# =======================
resource "aws_s3_bucket" "pricing_csv" {
  bucket = var.s3_bucket_name
  tags = var.tags
}

resource "aws_s3_bucket_object" "pricing_csv_file" {
  bucket = aws_s3_bucket.pricing_csv.bucket
  key    = "aws_instance_pricing.csv"
  source = "aws_instance_pricing.csv"
  acl    = "public-read"
}

# =======================
# AWS LAMBDA FUNCTION
# =======================
resource "aws_lambda_function" "pricing_api" {
  function_name = "aws_pricing_api"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.8"
  timeout       = 10
  filename      = "lambda_function.zip"

  environment {
    variables = {
      DB_SECRET_NAME = aws_secretsmanager_secret.rds_credentials.name
    }
  }

  tags = var.tags
}

# =======================
# API GATEWAY
# =======================
resource "aws_api_gateway_rest_api" "pricing_api" {
  name        = "AWS Pricing API"
  description = "API for AWS Pricing Data"
  tags        = var.tags
}

resource "aws_api_gateway_deployment" "pricing_api_deploy" {
  depends_on  = [aws_api_gateway_rest_api.pricing_api]
  rest_api_id = aws_api_gateway_rest_api.pricing_api.id
  stage_name  = "prod"
}

output "api_url" {
  value = aws_api_gateway_deployment.pricing_api_deploy.invoke_url
}
