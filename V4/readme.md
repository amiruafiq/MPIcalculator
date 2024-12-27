# MPI Calculator v4

## Overview
The **MPI Calculator v4** is a web-based tool designed to calculate the cost of AWS instances dynamically. It allows users to select parameters such as region, operating system, instance type, and additional EBS volume size, then computes:

1. **Price per Hour**
2. **Price per Month**
3. **EBS Cost per Month**
4. **Price with 30% Markup**

The application uses a JSON file (`api_data.json`) to fetch AWS pricing data and visualizes the cost breakdown through a dynamic chart.

---

## Features

- **Dynamic Dropdowns**: Populate region, operating system, and instance type from `api_data.json`.
- **Custom EBS Volume Input**: Allows users to specify EBS volume size (in GB).
- **Cost Calculations**:
  - Price per hour.
  - Price per month (including EBS cost).
  - Final price with a 30% markup.
- **Interactive Chart**: Displays a graphical cost breakdown.
- **Modern Design**: Responsive, user-friendly interface.

---

## File Structure

- `index.html`: Main application logic and interface.
- `api_data.json`: Source of AWS instance pricing and attributes.
- `readme.md`: Documentation for the project.

---

## Consuming `api_data.json`

### Overview
The application fetches and processes data from a locally stored `api_data.json` file. The JSON file contains details about AWS instances, including attributes and pricing terms.

### Example JSON Data
```json
{
  "product": {
    "productFamily": "Compute Instance",
    "attributes": {
      "location": "Asia Pacific (Tokyo)",
      "operatingSystem": "Windows",
      "instanceType": "c6i.large",
      "memory": "4 GiB",
      "vcpu": "2"
    }
  },
  "terms": {
    "OnDemand": {
      "2223B6PCG6QAUYY6.JRTCKXETXF": {
        "priceDimensions": {
          "2223B6PCG6QAUYY6.JRTCKXETXF.6YS6EN2CT7": {
            "pricePerUnit": {
              "USD": "0.2773000000"
            }
          }
        }
      }
    }
  }
}
```

### Key Attributes in `api_data.json`
- **`location`**: Region of the instance (e.g., `Asia Pacific (Tokyo)`).
- **`operatingSystem`**: OS type (e.g., `Windows`, `Linux`).
- **`instanceType`**: Instance type (e.g., `c6i.large`).
- **`pricePerUnit`**: Price per hour in USD.

---

## How the Application Works

1. **Fetching Data**:
   - The application fetches `api_data.json` using JavaScript's `fetch()` API when the page loads.

2. **Populating Dropdowns**:
   - Extracts unique values for region, operating system, and instance type from the `api_data.json` file.
   - Dynamically populates the dropdowns with these values.

3. **Cost Calculation**:
   - Based on the user's selections and EBS volume input, the script finds the relevant pricing details.
   - Computes:
     - Hourly cost from `pricePerUnit`.
     - Monthly cost using a formula: `hourly cost × 24 × 30 + (EBS volume × $0.10)`.
     - Final cost with a 30% markup.

4. **Visualization**:
   - Displays a bar chart using Chart.js to represent the cost breakdown.

---

## How to Use

1. Place `index.html` and `api_data.json` in the same directory.
2. Run a local server (e.g., using Python or Node.js):
   ```bash
   python -m http.server
   ```
3. Open `index.html` in your browser.
4. Select the region, operating system, and instance type from the dropdowns.
5. Enter the EBS volume (in GB).
6. Click the **Calculate Price** button to see the cost breakdown and graph.

---

## Requirements

- A modern browser with JavaScript enabled.
- Local server to avoid cross-origin restrictions when fetching `api_data.json`.
- Chart.js library included via CDN in the `<script>` tag.

---

## Future Enhancements

- Secure API keys for live data fetching.
- Support for additional pricing metrics.
- Integration with real-time AWS Pricing API.
- Improved error handling and user notifications.

---

## License
This project is under Afiq Kurshid's 
