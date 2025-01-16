
Open directory "V1/index.html" this is my case


Go to terminal "node app.js" - make sure already in folder
Ensure the server is running at http://localhost:3000:
Server running on http://localhost:3000


Open the provided URL (e.g., http://127.0.0.1:8080) in your browser.

Access the Backend API

To fetch instance types directly from the backend, visit:

"http://localhost:3000/api/instances"
@
"file:///Users/afiqkurshid/Documents/GitHub/MPIcalculator/V1/index.html"

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

