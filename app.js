// Import AWS SDK and credentials
const AWS = require("aws-sdk");
const credentials = require("./credentials");

// Configure AWS with credentials
AWS.config.update({
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey,
  region: credentials.region,
});

// Initialize EC2 service
const ec2 = new AWS.EC2();

// Fetch EC2 instance types dynamically
async function fetchInstanceTypes() {
  try {
    const params = {
      Filters: [
        { Name: "current-generation", Values: ["true"] } // Fetch only current-generation instances
      ],
    };

    const response = await ec2.describeInstanceTypes(params).promise();

    const instanceTypes = response.InstanceTypes.map((instance) => ({
      type: instance.InstanceType,
      cpu: instance.VCpuInfo.DefaultVCpus,
      ram: instance.MemoryInfo.SizeInMiB / 1024, // Convert MiB to GiB
    }));

    console.log("Fetched Instance Types:");
    console.table(instanceTypes);
  } catch (error) {
    console.error("Error fetching instance types:", error);
  }
}

// Execute the function
fetchInstanceTypes();
