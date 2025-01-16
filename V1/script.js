// Fetch instance types from the backend API
async function fetchInstanceTypes() {
  try {
    const response = await fetch("http://localhost:3000/api/instances");
    const instanceTypes = await response.json();

    console.log("Fetched Instance Types:", instanceTypes);

    // Populate the dropdown with the fetched data
    populateInstanceTypes(instanceTypes);

    // Save the instance types for calculation use
    window.instanceTypes = instanceTypes; // Save globally for access in calculation
  } catch (error) {
    console.error("Error fetching instance types:", error);
    document.getElementById("instanceTypeContainer").innerHTML =
      '<p class="error">Failed to load instance types. Please try again later.</p>';
  }
}

// Populate dropdown with instance types
function populateInstanceTypes(instanceTypes) {
  const container = document.getElementById("instanceTypeContainer");
  container.innerHTML = ""; // Clear existing content

  const instanceTypeDropdown = document.createElement("select");
  instanceTypeDropdown.id = "instanceType";
  instanceTypeDropdown.name = "instanceType";
  instanceTypeDropdown.style.width = "100%";

  instanceTypes.forEach((instance) => {
    const option = document.createElement("option");
    option.value = instance.type;
    option.textContent = `${instance.type} (CPU: ${instance.cpu}, RAM: ${instance.ram.toFixed(
      1
    )} GB)`;
    instanceTypeDropdown.appendChild(option);
  });

  container.appendChild(instanceTypeDropdown);
}

// Fetch EC2 pricing
async function fetchEC2Pricing(instanceType) {
  try {
    const response = await fetch(`http://localhost:3000/api/pricing?instanceType=${instanceType}`);
    const pricingData = await response.json();
    return pricingData.pricePerHour; // Return the hourly cost
  } catch (error) {
    console.error("Error fetching EC2 pricing:", error);
    return null;
  }
}

// Fetch EBS pricing
async function fetchStoragePricing() {
  try {
    const response = await fetch("http://localhost:3000/api/storagePricing");
    const pricingData = await response.json();
    return pricingData.pricePerGBMonth; // Return the cost per GB per month
  } catch (error) {
    console.error("Error fetching storage pricing:", error);
    return null;
  }
}

// Perform calculations
async function calculateCost() {
  const instanceType = document.getElementById("instanceType").value;
  const storageSize = parseInt(document.getElementById("storageSize").value, 10);

  if (!window.instanceTypes || !instanceType || isNaN(storageSize)) {
    alert("Please ensure all inputs are selected and valid.");
    return;
  }

  // Fetch dynamic pricing
  const ec2HourlyCost = await fetchEC2Pricing(instanceType);
  const storageCostPerGB = await fetchStoragePricing();

  if (ec2HourlyCost === null || storageCostPerGB === null) {
    alert("Failed to fetch pricing data. Please try again later.");
    return;
  }

  // Calculate storage hourly cost
  const storageHourlyCost = (storageSize * storageCostPerGB) / 720;

  // Individual calculations
  const combinedHourlyCost = ec2HourlyCost + storageHourlyCost;
  const monthlyCost = combinedHourlyCost * 24 * 30; // 30 days
  const finalCostWithMarkup = monthlyCost * 1.3; // 30% markup

  // Update results display
  const resultDisplay = document.getElementById("result-display");
  resultDisplay.innerHTML = `
    <p><strong>1) EC2 Cost per Hour:</strong> $${ec2HourlyCost.toFixed(4)}</p>
    <p><strong>2) EC2 + Storage Cost per Hour:</strong> $${combinedHourlyCost.toFixed(4)}</p>
    <p><strong>3) Monthly Cost (30 days):</strong> $${monthlyCost.toFixed(2)}</p>
    <p><strong>4) Monthly Cost with 30% Markup:</strong> $${finalCostWithMarkup.toFixed(2)}</p>
  `;
}

// Event listener for calculate button
document.getElementById("calculate-button").addEventListener("click", calculateCost);

// Event listener to fetch instance types on page load
document.addEventListener("DOMContentLoaded", fetchInstanceTypes);
