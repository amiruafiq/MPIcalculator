
## This is using DB Querry from csv file generated


# AWS Infrastructure Deployment with Terraform

## Overview
This project automates the deployment of AWS infrastructure using Terraform. The infrastructure includes:

- **RDS (MySQL)** for storing AWS instance pricing data
- **AWS Lambda** for handling API requests
- **API Gateway** to expose the Lambda function
- **S3 Bucket** to store the CSV pricing data
- **Secrets Manager** to securely store RDS credentials
- **Terraform Remote Backend** using S3 and DynamoDB for state management

## File Structure

```
.
├── main.tf          # Core AWS infrastructure deployment
├── backend.tf       # Terraform remote backend configuration
├── variables.tf     # Variable definitions
├── terraform.tfvars # Variable values
├── README.md        # Project documentation
```

## Prerequisites
Before applying the Terraform configuration, ensure you have:
- AWS CLI installed and configured (`aws configure`)
- Terraform installed (`terraform -v`)
- An S3 bucket and DynamoDB table for remote state management (see `backend.tf`)

## Setup Instructions

### 1️⃣ Initialize Terraform
Run the following command to initialize Terraform:
```sh
terraform init
```

### 2️⃣ Validate the Configuration
Ensure that your Terraform files are correctly formatted and valid:
```sh
terraform validate
```

### 3️⃣ Plan the Deployment
Run a dry-run to see what changes Terraform will make:
```sh
terraform plan
```

### 4️⃣ Deploy the Infrastructure
Apply the Terraform configuration to provision the resources:
```sh
terraform apply -auto-approve
```

### 5️⃣ Get the API Gateway URL
Once deployment is complete, Terraform will output the API Gateway URL:
```sh
Outputs:
api_url = "https://your-api-url/prod/pricing"
```

### 6️⃣ Query the API from Frontend
You can now use the API in your frontend application:
```javascript
fetch("https://your-api-url/prod/pricing?instance_type=t3.large&os_type=Redhat9Base&region=Singapore")
  .then(response => response.json())
  .then(data => console.log(data));
```

## Infrastructure Details

### **🔹 RDS Database**
- Engine: MySQL
- Instance Type: `db.t3.micro`
- Stores AWS instance pricing data
- Credentials stored securely in AWS Secrets Manager

### **🔹 AWS Lambda**
- Written in Python (`lambda_function.py`)
- Retrieves instance pricing data from RDS
- Connected to API Gateway

### **🔹 API Gateway**
- Exposes the Lambda function via REST API
- Supports `GET` requests to fetch pricing data

### **🔹 S3 Bucket**
- Stores CSV pricing data
- Public read access for CSV file

### **🔹 Secrets Manager**
- Stores RDS credentials securely
- Accessed by Lambda function

### **🔹 Terraform Backend**
- Stores Terraform state in an S3 bucket
- Uses DynamoDB for state locking

## Security Considerations
- **Secrets Manager** is used to prevent hardcoded database credentials.
- **IAM Policies** restrict Lambda access to only necessary AWS services.
- **Terraform Backend** ensures safe and scalable infrastructure management.

## Next Steps
- Deploy the Lambda function code (`lambda_function.py`)
- Integrate with a frontend UI
- Automate deployments using GitHub Actions or Terraform Cloud

---

### **🚀 Your AWS Infrastructure is Ready!**

