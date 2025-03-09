variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ec2_key_pair" {
  description = "Key pair name for EC2 SSH access"
  type        = string
  default     = "your-key-pair"
}

variable "git_repo" {
  description = "Git repository URL for the application"
  type        = string
  default     = "https://github.com/your-repo/your-app.git"
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