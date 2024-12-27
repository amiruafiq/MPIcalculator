// Fetch instance types from the backend API
async function fetchInstanceTypes() {
  try {
    const response = await fetch("http://localhost:3000/api/instances");
    const instanceTypes = await response.json();

    console.log("Fetched Instance Types:", instanceTypes);

    // Populate the dropdown with the fetched data
    populateInstanceTypes(instanceTypes);
  } catch (error) {
    console.error("Error fetching instance types:", error);
  }
}

// Populate dropdown with instance types
function populateInstanceTypes(instanceTypes) {
  const container = document.getElementById("instanceTypeContainer");
  container.innerHTML = ""; // Clear existing content

  const instanceTypeDropdown = document.createElement("select");
  instanceTypeDropdown.id = "instanceType";
  instanceTypeDropdown.size = 10;
  instanceTypeDropdown.style.width = "100%";
  instanceTypeDropdown.style.overflowY = "scroll";

  instanceTypes.forEach((instance) => {
    const option = document.createElement("option");
    option.value = instance.type;
    option.textContent = `${instance.type} (CPU: ${instance.cpu}, RAM: ${instance.ram.toFixed(1)}GB)`;
    instanceTypeDropdown.appendChild(option);
  });

  container.appendChild(instanceTypeDropdown);
}

// Event listener to fetch instance types on page load
document.addEventListener("DOMContentLoaded", fetchInstanceTypes);
