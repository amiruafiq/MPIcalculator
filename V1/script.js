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

// Perform calculation
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

  // Example cost calculation logic (adjust as needed)
  const cpuCost = selectedInstance.cpu * 0.05; // $0.05 per CPU
  const ramCost = selectedInstance.ram * 0.01; // $0.01 per GB of RAM
  const storageCost = storageSize * 0.02; // $0.02 per GB of storage

  const totalCost = cpuCost + ramCost + storageCost;

  // Update the results display
  document.getElementById(
    "result-display"
  ).textContent = `Estimated Cost: $${totalCost.toFixed(2)} per hour.`;
}

// Event listener for calculate button
document.getElementById("calculate-button").addEventListener("click", calculateCost);

// Event listener to fetch instance types on page load
document.addEventListener("DOMContentLoaded", fetchInstanceTypes);
