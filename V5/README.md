
## This is using DB Querry from csv file generated


# AWS Infrastructure Deployment with Terraform

## Overview
This Terraform configuration sets up an **AWS-based infrastructure** for hosting a **Node.js application on EC2**, connected to an **RDS (MySQL) database**. The infrastructure includes:

- **EC2 Instance (Amazon Linux 2)** for hosting the frontend and backend (Node.js).
- **RDS (MySQL)** for storing AWS instance pricing data.
- **Security Group** with appropriate ports open (SSH, HTTP, Node.js API).
- **Remote Terraform Backend** using S3 and DynamoDB for state management.

## File Structure

```
.
├── main.tf          # Core AWS infrastructure deployment
├── backend.tf       # Terraform remote backend configuration
├── variables.tf     # Variable definitions
├── terraform.tfvars # Variable values (optional)
├── README.md        # Project documentation
```

## Prerequisites
Before applying the Terraform configuration, ensure you have:
- **AWS CLI installed and configured** (`aws configure`)
- **Terraform installed** (`terraform -v`)
- **An S3 bucket and DynamoDB table** for remote state management (see `backend.tf`)
- **A valid EC2 key pair** for SSH access

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

### 5️⃣ Connect to the EC2 Instance
Once the EC2 instance is created, connect via SSH:
```sh
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

### 6️⃣ Verify Node.js and API Deployment
Your Node.js API should be running on **port 3000**.
You can test it with:
```sh
curl http://your-ec2-public-ip:3000/pricing?instance_type=t3.large&os_type=Redhat9Base&region=Singapore
```

## Infrastructure Details

### **🔹 EC2 Instance**
- **OS:** Amazon Linux 2
- **Software Installed:** Node.js, PM2, Git
- **Runs Frontend + Backend (Express.js)**
- **Exposed Ports:** 22 (SSH), 80 (HTTP), 3000 (Node.js API)

### **🔹 RDS Database**
- **Engine:** MySQL
- **Instance Type:** `db.t3.micro`
- **Stores AWS instance pricing data**

### **🔹 Security Group**
- Allows **SSH (22)**, **HTTP (80)**, and **Node.js API (3000)** access.

### **🔹 Terraform Backend**
- Stores Terraform **state in an S3 bucket**
- Uses **DynamoDB for state locking**

## Security Considerations
- **RDS credentials are stored securely in Terraform variables.**
- **EC2 SSH access should be limited to trusted IPs.**
- **Consider adding HTTPS (SSL) for secure API access.**

## Next Steps
- **Deploy the Node.js application** inside EC2 (`server.js`).
- **Integrate a frontend UI** (React/Vue/HTML).
- **Implement auto-scaling** for EC2.
- **Enhance security** with IAM roles and parameterized DB credentials.

---

### **🚀 Your AWS Infrastructure is Ready!**

