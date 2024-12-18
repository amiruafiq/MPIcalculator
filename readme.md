Updated File Overview
index.html:

Your main frontend file.
Links to script.js for dynamic content and styles.css for styling.
credentials.js (instead of credentials.json):

Store AWS credentials temporarily in this file (not ideal for production).
script.js:

Fetch EC2 instance types using the AWS SDK in the browser.
Populate the dropdown with the fetched instance types.
Perform cost calculations.
styles.css:

Same as before, for styling.