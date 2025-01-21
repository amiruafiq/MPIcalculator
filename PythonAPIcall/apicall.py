import requests
import json

url = "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.json"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    # Process the data as needed
    with open('ec2_pricing.json', 'w') as f:
        json.dump(data, f)
else:
    print("Failed to retrieve data")