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
resource "local_file" "lambda_python_script" {
  filename = "lambda_function.py"
  content  = <<EOT
import json
import boto3
import pymysql
import os
import base64
from botocore.exceptions import ClientError

def get_secret():
    secret_name = os.environ['DB_SECRET_NAME']
    region_name = os.environ.get('AWS_REGION', 'ap-southeast-1')
    
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise e
    
    if 'SecretString' in get_secret_value_response:
        return json.loads(get_secret_value_response['SecretString'])
    else:
        return json.loads(base64.b64decode(get_secret_value_response['SecretBinary']))

def lambda_handler(event, context):
    secret = get_secret()
    connection = pymysql.connect(
        host=os.environ['DB_HOST'],
        user=secret['username'],
        password=secret['password'],
        database='aws_pricing',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    query_params = event.get('queryStringParameters', {})
    instance_type = query_params.get('instance_type', '')
    os_type = query_params.get('os_type', '')
    region = query_params.get('region', '')
    
    if not instance_type or not os_type or not region:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing required parameters"})
        }
    
    try:
        with connection.cursor() as cursor:
            sql = """
            SELECT price_per_hour FROM aws_instance_pricing 
            WHERE instance_type=%s AND os_type=%s AND region=%s
            """
            cursor.execute(sql, (instance_type, os_type, region))
            result = cursor.fetchone()
        
        if result:
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "instance_type": instance_type,
                    "os_type": os_type,
                    "region": region,
                    "price_per_hour": result['price_per_hour']
                })
            }
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Pricing data not found"})
            }
    
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    
    finally:
        connection.close()
EOT
}

resource "aws_lambda_function" "pricing_api" {
  function_name = "aws_pricing_api"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.8"
  timeout       = 10

  filename         = local_file.lambda_python_script.filename
  source_code_hash = filebase64sha256(local_file.lambda_python_script.filename)

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
