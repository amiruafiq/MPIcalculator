// Populate Dropdown with Search Bar, Filter, and Scroll
function populateInstanceTypes(instanceTypes) {
    const container = document.getElementById("instanceTypeContainer");
    container.innerHTML = ""; // Clear existing content
  
    console.log("Populating Instance Types..."); // Debug log
  
    // Create filter dropdown
    const filterDropdown = document.createElement("select");
    filterDropdown.id = "filterDropdown";
    filterDropdown.style.marginBottom = "10px";
    filterDropdown.style.width = "100%";
  
    // Populate filter options (e.g., t2, t3, etc.)
    const uniqueFamilies = Array.from(new Set(instanceTypes.map((instance) => instance.type.split(".")[0])));
    uniqueFamilies.forEach((family) => {
      const option = document.createElement("option");
      option.value = family;
      option.textContent = family;
      filterDropdown.appendChild(option);
    });
  
    // Create search bar
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search instance type...";
    searchInput.style.marginBottom = "10px";
    searchInput.style.width = "100%";
  
    // Create dropdown container
    const instanceTypeDropdown = document.createElement("select");
    instanceTypeDropdown.id = "instanceType";
    instanceTypeDropdown.size = 10; // Enable multiple visible options
    instanceTypeDropdown.style.width = "100%";
  
    container.appendChild(filterDropdown);
    container.appendChild(searchInput);
    container.appendChild(instanceTypeDropdown);
  
    function filterOptions() {
      const searchValue = searchInput.value.toLowerCase();
      const selectedFamily = filterDropdown.value;
  
      Array.from(instanceTypeDropdown.options).forEach((option) => {
        const isFamilyMatch = option.value.startsWith(selectedFamily);
        const isSearchMatch = option.textContent.toLowerCase().includes(searchValue);
        option.style.display = isFamilyMatch && isSearchMatch ? "" : "none";
      });
    }
  
    filterDropdown.addEventListener("change", filterOptions);
    searchInput.addEventListener("input", filterOptions);
  
    instanceTypes.forEach((instance) => {
      const option = document.createElement("option");
      option.value = instance.type;
      option.textContent = `${instance.type} (CPU: ${instance.cpu}, RAM: ${instance.ram.toFixed(1)}GB)`;
      instanceTypeDropdown.appendChild(option);
    });
  }
   