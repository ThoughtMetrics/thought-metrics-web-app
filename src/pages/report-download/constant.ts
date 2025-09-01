export const reportDownloadConstant = {
  "initialFormData": {
    "firstName": "",
    "lastName": "",
    "businessEmail": "",
    "phone": "",
    "countryOrRegion": "India",
    "company": "",
    "jobTitle": "",
    "subscribeNewsletter": false,
    "dataUsageConsent": false
  },
  "countries": [
    { "code": "IN", "name": "India" },
    { "code": "US", "name": "United States" },
    { "code": "GB", "name": "United Kingdom" },
    { "code": "CA", "name": "Canada" },
    { "code": "AU", "name": "Australia" },
    { "code": "DE", "name": "Germany" },
    { "code": "FR", "name": "France" },
    { "code": "SG", "name": "Singapore" },
    { "code": "JP", "name": "Japan" },
    { "code": "BR", "name": "Brazil" }
  ],
  "countryCodes": [
    { "code": "+91", "country": "India" },
    { "code": "+1", "country": "USA" },
    { "code": "+44", "country": "UK" },
    { "code": "+49", "country": "Germany" },
    { "code": "+33", "country": "France" },
    { "code": "+65", "country": "Singapore" }
  ],
  "defaultCountryCode": "+91",
  "storeName": "whitepaper-form-store",
  "validationMessages": {
    "firstName": "First name is required",
    "lastName": "Last name is required",
    "businessEmail": {
      "required": "Business email is required",
      "invalid": "Business email is invalid"
    },
    "countryOrRegion": "Country or region is required",
    "company": "Company is required",
    "dataUsageConsent": "You must agree to our data usage policy to download the whitepaper",
    "submitError": "Download failed. Please try again."
  },
  "emailRegex": "\\S+@\\S+\\.\\S+",
  "formResetDelay": 2000,
  "apiSimulationDelay": 1500,
  "ui": {
    "pageTitle": "Download Whitepaper",
    "mainHeading": "Please fill out the form below to gain access to the white paper",
    "loginPrompt": "Already have an Thought Metrics account?",
    "loginLink": "Log in",
    "fieldLabels": {
      "firstName": "First name",
      "lastName": "Last name", 
      "businessEmail": "Business email",
      "phone": "Phone (Optional)",
      "countryOrRegion": "Country or region of residence",
      "company": "Company",
      "jobTitle": "Job title (Optional)"
    },
    "checkboxLabels": {
      "subscribeNewsletter": "Subscribe to the Thought Metrics newsletter for industry news and analysis across business research.",
      "dataUsageConsent": "I'd like Thought Metrics to use my contact details to keep me informed about products, services, and offers. More information on how Thought Metrics uses data and ways to opt-out can be found in the Thought Metrics Privacy Statement."
    },
    "buttons": {
      "download": "Download White paper",
      "downloading": "Downloading..."
    },
    "successMessage": {
      "title": "Download Started!",
      "description": "Your whitepaper download has begun. Check your email for additional resources and follow-up information."
    }
  }
}