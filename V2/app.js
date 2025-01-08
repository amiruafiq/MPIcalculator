import credentials from './credentials.js'; // Import the module as 'credentials'

// Initialize AWS SDK
AWS.config.update({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    region: "us-east-1" // or any other region you want to use
});



const pricing = new AWS.Pricing();

/**
 * Fetch pricing data from AWS Pricing API
 */
export async function fetchPricing(region, os, storageSize) {
    try {
        const filters = [
            { Type: "TERM_MATCH", Field: "location", Value: mapRegionToLocation(region) },
            { Type: "TERM_MATCH", Field: "operatingSystem", Value: os },
        ];

        console.log("Filters for AWS Pricing API:", filters); // Debug log

        const response = await pricing.getProducts({
            ServiceCode: "AmazonEC2",
            Filters: filters
        }).promise();

        console.log("AWS Pricing API Response (PriceList):", response.PriceList); // Debug log

        if (!response.PriceList || response.PriceList.length === 0) {
            console.error("No pricing data found.");
            return null;
        }

        const pricePerGB = extractPriceFromResponse(response);
        return pricePerGB * storageSize;
    } catch (error) {
        console.error("Error fetching pricing data:", error);
        return null;
    }
}

/**
 * Extract price per GB from AWS Pricing API response
 */
function extractPriceFromResponse(response) {
    if (response.PriceList && response.PriceList.length > 0) {
        for (const priceItem of response.PriceList) {
            // Check if "terms.OnDemand" exists
            if (priceItem.terms && priceItem.terms.OnDemand) {
                console.log("Valid Price Item with OnDemand Terms:", priceItem);

                const terms = priceItem.terms.OnDemand;
                const termKey = Object.keys(terms)[0]; // Get the first term key
                if (!termKey) {
                    console.error("No term keys found in OnDemand terms.");
                    continue; // Skip to the next item
                }

                const priceDimensions = terms[termKey].priceDimensions;
                const dimensionKey = Object.keys(priceDimensions)[0]; // Get the first dimension key
                if (!dimensionKey) {
                    console.error("No dimension keys found in price dimensions.");
                    continue; // Skip to the next item
                }

                const pricePerGB = parseFloat(priceDimensions[dimensionKey].pricePerUnit.USD);
                console.log("Extracted Price Per GB:", pricePerGB);
                return pricePerGB;
            }
        }

        console.error("No valid OnDemand terms found in the entire PriceList.");
        return 0;
    }

    console.error("No price list found in the response.");
    return 0;
}


/**
 * Map region codes to AWS Pricing API locations
 */
function mapRegionToLocation(region) {
    const regionMap = {
        "us-east-1": "US East (N. Virginia)",
        "us-west-1": "US West (N. California)",
        "eu-central-1": "EU (Frankfurt)",
    };
    return regionMap[region] || region;
}
