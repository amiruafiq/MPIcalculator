provider "aws" {
  region = var.aws_region
}

# =======================
# Security Group for EC2
# =======================
resource "aws_security_group" "web_sg" {
  name_prefix = "web-sg"
  description = "Allow web traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow SSH
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow HTTP
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow Node.js API
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# =======================
# EC2 Instance
# =======================
resource "aws_instance" "web_server" {
  ami             = "ami-09e67e426f25ce0d7" # Amazon Linux 2 AMI
  instance_type   = var.ec2_instance_type
  key_name        = var.ec2_key_pair
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tags = var.tags

  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y gcc-c++ make
    curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
    sudo yum install -y nodejs
    sudo npm install -g pm2
    sudo yum install -y git
    git clone ${var.git_repo} /home/ec2-user/app
    cd /home/ec2-user/app
    npm install
    pm2 start server.js
    pm2 startup
    pm2 save
  EOF
}

# =======================
# RDS Database
# =======================
resource "aws_db_instance" "aws_pricing_db" {
  identifier            = "aws-pricing-db"
  engine               = "mysql"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  db_name              = "aws_pricing"
  username            = var.rds_username
  password            = var.rds_password
  publicly_accessible = false
  skip_final_snapshot = true
  
  tags = var.tags
}