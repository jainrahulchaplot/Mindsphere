const fs = require('fs');
const path = require('path');

// Helper function to get Google Cloud credentials
function getGoogleCredentials() {
  // Try base64 encoded credentials first
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    try {
      const credentials = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8');
      const tempFile = path.join(__dirname, 'temp-credentials.json');
      fs.writeFileSync(tempFile, credentials);
      return tempFile;
    } catch (error) {
      console.log('⚠️ Failed to decode base64 credentials:', error.message);
    }
  }
  
  // Fallback to file path
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  
  return null;
}

module.exports = { getGoogleCredentials };
