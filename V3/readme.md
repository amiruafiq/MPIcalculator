Features for Version 3 (Data Fetching and Display)
User Inputs:

Dropdowns or input fields for:
Region (e.g., US-East, AP-Southeast).
Operating System (e.g., Linux, Windows).
EC2 Instance Types (e.g., t2.micro, m5.large).
EBS Storage Size (in GB).
Data Fetching:

AWS API Integration to retrieve:
List of available regions.
Supported operating systems.
EC2 instance types and their metadata (e.g., pricing, specs).
EBS volume types and maximum sizes.
Dynamic Updates:

Fields like EC2 instance types and OS should update based on the selected region.
Frontend:

Simple form-based UI with responsive design.
Display fetched data below inputs for user confirmation.
Step-by-Step Plan
1. AWS APIs Setup
Use AWS Pricing APIs or AWS SDK to fetch the data dynamically.
Example API calls:
DescribeRegions API for region data.
Pricing API for EC2 instance types, OS, and EBS costs.
2. Backend API
Set up a lightweight backend (optional) using Node.js or Python.
The backend will handle API requests securely, ensuring AWS access keys are not exposed on the frontend.
3. Frontend Development
Framework: Vanilla JS, React, or Vue.js for interactivity.
Implement a form with the following fields:
Dropdown for regions.
Dropdown for OS types (updated dynamically based on region).
Dropdown for EC2 instance types.
Input for EBS storage size (number field).
4. API Key Security
For now:
Hardcode the access and secret keys for AWS in the backend.
Later:
Use AWS IAM roles or Secrets Manager for secure key handling.
5. Hosting
Start with local hosting (e.g., live server, localhost).
Later move to AWS services like S3 with CloudFront or Amplify.


Deliverables for First Phase
Functional webpage where:
User selects inputs (region, OS, EC2 instance, EBS size).
Backend fetches and displays corresponding data dynamically.
No calculations yet, only data fetching and display.