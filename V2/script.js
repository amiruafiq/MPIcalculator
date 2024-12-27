import { fetchPricing } from './app.js';

// Fetch regions and populate dropdown
async function fetchRegions() {
    const regions = [
        { code: "us-east-1", name: "US East (N. Virginia)" },
        { code: "us-west-1", name: "US West (N. California)" },
        { code: "eu-central-1", name: "EU (Frankfurt)" }
    ];
    populateRegionsDropdown(regions);
}

// Populate regions dropdown
function populateRegionsDropdown(regions) {
    const regionDropdown = document.getElementById("region");
    regionDropdown.innerHTML = ""; // Clear existing options

    regions.forEach((region) => {
        const option = document.createElement("option");
        option.value = region.code;
        option.textContent = `${region.name} (${region.code})`;
        regionDropdown.appendChild(option);
    });
}

// Fetch instance types and populate dropdown
async function fetchInstanceTypes() {
    const instanceTypes = [
        { type: "t2.micro", cpu: 1, ram: 1 },
        { type: "t3.medium", cpu: 2, ram: 4 },
        { type: "m5.large", cpu: 2, ram: 8 }
    ];
    populateInstanceTypes(instanceTypes);
}

// Populate instance types dropdown
function populateInstanceTypes(instanceTypes) {
    const instanceTypeContainer = document.getElementById("instanceTypeContainer");
    instanceTypeContainer.innerHTML = ""; // Clear existing content

    const dropdown = document.createElement("select");
    dropdown.id = "instanceType";
    dropdown.size = 10;
    dropdown.style.width = "100%";

    instanceTypes.forEach((instance) => {
        const option = document.createElement("option");
        option.value = instance.type;
        option.textContent = `${instance.type} (CPU: ${instance.cpu}, RAM: ${instance.ram}GB)`;
        dropdown.appendChild(option);
    });

    instanceTypeContainer.appendChild(dropdown);
}

// Handle Calculate button click
async function handleCalculateClick() {
    const region = document.getElementById("region").value;
    const os = document.getElementById("os").value;
    const storageSize = parseInt(document.getElementById("storageSize").value);

    if (isNaN(storageSize) || storageSize <= 0) {
        alert("Please enter a valid storage size.");
        return;
    }

    const basePrice = await fetchPricing(region, os, storageSize);
    if (basePrice !== null) {
        const markupPrice = basePrice * 1.30;
        document.getElementById("basePrice").textContent = `$${basePrice.toFixed(2)}`;
        document.getElementById("markupPrice").textContent = `$${markupPrice.toFixed(2)}`;
    } else {
        alert("Failed to fetch pricing.");
    }
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchRegions();
    fetchInstanceTypes();
    document.getElementById("calculateBtn").addEventListener("click", handleCalculateClick);
});
