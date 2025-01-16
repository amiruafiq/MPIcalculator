const AWS = require("aws-sdk");
const express = require("express");
const cors = require("cors");
const credentials = require("./credentials"); // Import your credentials.js

const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());

// Configure AWS
AWS.config.update({
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey,
  region: credentials.region,
});

const ec2 = new AWS.EC2();

// API Endpoint to Fetch Instance Types
app.get("/api/instances", async (req, res) => {
  try {
    const params = { Filters: [{ Name: "current-generation", Values: ["true"] }] };
    const response = await ec2.describeInstanceTypes(params).promise();

    const instanceTypes = response.InstanceTypes.map((instance) => ({
      type: instance.InstanceType,
      cpu: instance.VCpuInfo.DefaultVCpus,
      ram: instance.MemoryInfo.SizeInMiB / 1024, // Convert MiB to GiB
    }));

    res.json(instanceTypes);
  } catch (error) {
    console.error("Error fetching instance types:", error);
    res.status(500).json({ error: "Failed to fetch instance types", details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
