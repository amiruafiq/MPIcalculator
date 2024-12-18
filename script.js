// Configure AWS
AWS.config.update(awsConfig);

// Initialize AWS Services
const ec2 = new AWS.EC2();
const pricing = new AWS.Pricing({ region: "us-east-1" });

// Fetch Instance Types
async function fetchInstanceTypes() {
  const params = {
    Filters: [{ Name: "current-generation", Values: ["true"] }], // Fetch current-generation instances
  };

  try {
    const response = await ec2.describeInstanceTypes(params).promise();
    const instanceTypes = response.InstanceTypes.map((instance) => ({
      type: instance.InstanceType,
      cpu: instance.VCpuInfo.DefaultVCpus,
      ram: instance.MemoryInfo.SizeInMiB / 1024, // Convert MiB to GiB
    }));

    populateInstanceTypes(instanceTypes);
  } catch (error) {
    console.error("Error fetching instance types:", error);
  }
}

// Populate Dropdown
function populateInstanceTypes(instanceTypes) {
  const instanceTypeDropdown = document.getElementById("instanceType");
  instanceTypeDropdown.innerHTML = ""; // Clear existing options

  instanceTypes.forEach((instance) => {
    const option = document.createElement("option");
    option.value = instance.type;
    option.textContent = `${instance.type} (CPU: ${instance.cpu}, RAM: ${instance.ram.toFixed(1)}GB)`;
    instanceTypeDropdown.appendChild(option);
  });
}

// Fetch Price for EC2 Instances
async function fetchInstancePrice(instanceType) {
    const params = {
      ServiceCode: "AmazonEC2",
      Filters: [
        { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType },
        { Type: "TERM_MATCH", Field: "location", Value: "US East (N. Virginia)" }, // Adjust region
        { Type: "TERM_MATCH", Field: "operatingSystem", Value: "Linux" }, // Adjust OS
        { Type: "TERM_MATCH", Field: "tenancy", Value: "Shared" }, // Shared tenancy
      ],
    };
  
    try {
      const response = await pricing.getProducts(params).promise();
      console.log("Pricing API Response:", response);
  
      if (!response.PriceList || response.PriceList.length === 0) {
        throw new Error("No pricing data available for the selected instance type.");
      }
  
      // Extract the first item from the PriceList
      const priceData = typeof response.PriceList[0] === "string"
        ? JSON.parse(response.PriceList[0]) // Parse only if it's a string
        : response.PriceList[0];
      console.log("Parsed Price Data:", priceData);
  
// Extract On-Demand Pricing
const onDemand = priceData.terms.OnDemand; // Access the On-Demand pricing object

// Get the first On-Demand term key
const firstTermKey = Object.keys(onDemand)[0]; // Example: "GQNKTDHNVN3P4APG.JRTCKXETXF"

// Access price dimensions under the On-Demand term
const priceDimensions = onDemand[firstTermKey].priceDimensions;

// Get the first price dimension key
const firstPriceDimensionKey = Object.keys(priceDimensions)[0]; // Example: "JRTCKXETXF.6YS6EN2CT7"

// Extract the USD price per hour from the price dimension
const pricePerHour = parseFloat(priceDimensions[firstPriceDimensionKey].pricePerUnit.USD);

console.log("Price Per Hour:", pricePerHour); // Log the extracted price per hour for debugging

  
      return pricePerHour;
    } catch (error) {
      console.error("Error fetching instance price:", error);
      return 0; // Default fallback price
    }
  }
  
  

// Calculate Price
async function calculatePrice() {
    const selectedInstanceType = document.getElementById("instanceType").value;
    const storageType = document.getElementById("storageType").value;
    const storageSize = parseInt(document.getElementById("storageSize").value);
  
    if (!selectedInstanceType) {
      alert("Please select an instance type.");
      return;
    }
  
    try {
      // Fetch price for the selected instance type
      const instancePrice = await fetchInstancePrice(selectedInstanceType);
  
      // Calculate storage cost
      const storageCost = storageSize * (storageType === "SSD" ? 0.2 : 0.1);
  
      // Total cost with 30% markup
      const totalCost = (instancePrice + storageCost) * 1.3;
  
      // Display result
      document.getElementById("result-display").innerHTML = `
        <h2>Results</h2>
        <p><strong>Instance Type:</strong> ${selectedInstanceType}</p>
        <p><strong>Instance Cost (per hour):</strong> $${instancePrice.toFixed(2)}</p>
        <p><strong>Storage Cost:</strong> $${storageCost.toFixed(2)}</p>
        <p><strong>Total Cost (with 30% markup):</strong> $${totalCost.toFixed(2)}</p>
      `;
    } catch (error) {
      console.error("Error calculating price:", error);
      document.getElementById("result-display").textContent = "Error calculating price.";
    }
  }
  

// Event Listeners
document.getElementById("calculate-button").addEventListener("click", calculatePrice);
document.addEventListener("DOMContentLoaded", fetchInstanceTypes);
