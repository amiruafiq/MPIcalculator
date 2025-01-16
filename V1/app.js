const AWS = require("aws-sdk");
const express = require("express");
const cors = require("cors");
const path = require("path");
const credentials = require("./credentials"); // Import AWS credentials

const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Configure AWS
AWS.config.update({
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey,
  region: credentials.region,
});

// API: Fetch Instance Types
app.get("/api/instances", async (req, res) => {
  try {
    const ec2 = new AWS.EC2();
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
    res.status(500).json({ error: "Failed to fetch instance types" });
  }
});

// API: Fetch Pricing for EC2 Instances
app.get("/api/pricing", async (req, res) => {
  const { instanceType } = req.query;

  if (!instanceType) {
    return res.status(400).json({ error: "Instance type is required." });
  }

  console.log("Fetching pricing for instanceType:", instanceType);

  try {
    const params = {
      ServiceCode: "AmazonEC2",
      Filters: [
        { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType },
        { Type: "TERM_MATCH", Field: "operatingSystem", Value: "Linux" },
        { Type: "TERM_MATCH", Field: "preInstalledSw", Value: "NA" },
        { Type: "TERM_MATCH", Field: "tenancy", Value: "Shared" },
      ],
    };

    const pricing = new AWS.Pricing({ region: "us-east-1" });
    const response = await pricing.getProducts(params).promise();

    // Log the first item in response.PriceList
    if (response.PriceList && response.PriceList.length > 0) {
      console.log("First Item in PriceList:", JSON.stringify(response.PriceList[0], null, 2));
    } else {
      console.log("PriceList is empty or undefined.");
    }

    const pricePerHour = extractPriceFromAWSResponse(response);
    res.json({ pricePerHour });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    res.status(500).json({ error: "Failed to fetch pricing.", details: error.message });
  }
});



// Helper Function: Extract Price from AWS Response
function extractPriceFromAWSResponse(response) {
  if (!response.PriceList || response.PriceList.length === 0) {
    throw new Error("No pricing data found in the response.");
  }

  try {
    // Parse the first entry in the PriceList
    const productData = typeof response.PriceList[0] === "string"
      ? JSON.parse(response.PriceList[0]) // If it's a string, parse it
      : response.PriceList[0]; // If it's already an object, use it directly

    // Look for On-Demand pricing terms
    const onDemandTerms = productData.terms.OnDemand;
    const onDemandKey = Object.keys(onDemandTerms).find((key) => key);

    if (!onDemandKey) {
      throw new Error("On-Demand pricing not found for this instance.");
    }

    // Extract price dimensions
    const priceDimensions = onDemandTerms[onDemandKey].priceDimensions;
    const dimensionKey = Object.keys(priceDimensions).find(
      (key) => priceDimensions[key].unit === "Hrs"
    );

    if (!dimensionKey) {
      throw new Error("Hourly pricing not found for this instance.");
    }

    // Return the USD price per unit
    const pricePerUnit = priceDimensions[dimensionKey].pricePerUnit.USD;
    return parseFloat(pricePerUnit);
  } catch (error) {
    console.error("Error parsing AWS Pricing API response:", error);
    throw new Error("Failed to parse pricing data for this instance.");
  }
}


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
