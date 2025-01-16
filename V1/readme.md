Cloud Cost Calculator

This project is a Cloud Cost Calculator built using Node.js, Express, AWS SDK, and a simple frontend interface. The application fetches and calculates the cost of AWS EC2 instances based on user inputs.

How to Start the Project

Prerequisites

Node.js: Ensure you have Node.js installed on your system.

Download Node.js

AWS Account: An active AWS account with credentials to access EC2 services.

Installation

Clone the repository:

git clone <repository-url>
cd MPIcalculator/V1

Install dependencies:

npm install

Configure AWS credentials:

Open credentials.js and update the following fields:

const awsConfig = {
  accessKeyId: "<your-access-key>",
  secretAccessKey: "<your-secret-key>",
  region: "<your-region>" // e.g., us-east-1
};

Starting the Server

Start the Node.js server:

node app.js

Ensure the server is running at http://localhost:3000:

Server running on http://localhost:3000

What to Put in the Browser

Access the Frontend

Open the index.html file directly in your browser:

file:///path/to/MPIcalculator/V1/index.html

Alternatively, serve the directory using a static file server (like http-server):

Install http-server (if not already installed):

npm install -g http-server

Serve the directory:

http-server .

Open the provided URL (e.g., http://127.0.0.1:8080) in your browser.

Access the Backend API

To fetch instance types directly from the backend, visit:

http://localhost:3000/api/instances

Expected Output

After selecting the instance type, storage size, and clicking "Calculate," the estimated cost will be displayed.

Example Output



Project Structure
![alt text](img/1.png)
![alt text](img/2.png)


Troubleshooting

If the browser shows Failed to load instance types:

Verify the Node.js server is running.

Ensure AWS credentials in credentials.js are correct.

Check for CORS issues in the browser console.

If prices are not displaying, ensure:

API is returning valid data (http://localhost:3000/api/instances).

JavaScript logic in script.js correctly calculates and updates the UI.

License

This project is for educational purposes only. AWS credentials and sensitive information should never be hardcoded in production.

