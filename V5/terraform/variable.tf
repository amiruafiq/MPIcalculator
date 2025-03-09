variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for pricing CSV"
  type        = string
  default     = "aws-pricing-csv-bucket"
}

variable "rds_username" {
  description = "Database username for RDS"
  type        = string
  default     = "admin"
}

variable "rds_password" {
  description = "Database password for RDS"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Tags for AWS resources"
  type        = map(string)
  default = {
    project     = "MpiCalculator"
    owner       = "Afiq"
    environment = "Development"
  }
}
