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

// Perform calculations
function calculateCost() {
  const instanceType = document.getElementById("instanceType").value;
  const storageSize = parseInt(document.getElementById("storageSize").value, 10);

  if (!window.instanceTypes || !instanceType || isNaN(storageSize)) {
    alert("Please ensure all inputs are selected and valid.");
    return;
  }

  // Find selected instance details
  const selectedInstance = window.instanceTypes.find(
    (instance) => instance.type === instanceType
  );

  if (!selectedInstance) {
    alert("Selected instance type not found.");
    return;
  }

  // Example cost calculation logic
  const ec2HourlyCost = 0.469; // Example: hourly rate for m6id.2xlarge in USD
  const storageCostPerGB = 0.08; // Example: per GB-month for GP3 storage in USD

  // Individual calculations
  const ec2Cost = ec2HourlyCost;
  const storageCost = storageSize * storageCostPerGB / 720; // Convert monthly to hourly
  const combinedHourlyCost = ec2Cost + storageCost;
  const monthlyCost = combinedHourlyCost * 24 * 30; // 30 days
  const finalCostWithMarkup = monthlyCost * 1.3; // 30% markup

  // Update results display
  const resultDisplay = document.getElementById("result-display");
  resultDisplay.innerHTML = `
    <p><strong>1) EC2 Cost per Hour:</strong> $${ec2Cost.toFixed(2)}</p>
    <p><strong>2) EC2 + Storage Cost per Hour:</strong> $${combinedHourlyCost.toFixed(2)}</p>
    <p><strong>3) Monthly Cost (30 days):</strong> $${monthlyCost.toFixed(2)}</p>
    <p><strong>4) Monthly Cost with 30% Markup:</strong> $${finalCostWithMarkup.toFixed(2)}</p>
  `;
}

// Event listener for calculate button
document.getElementById("calculate-button").addEventListener("click", calculateCost);

// Event listener to fetch instance types on page load
document.addEventListener("DOMContentLoaded", fetchInstanceTypes);
