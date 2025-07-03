const fs = require('fs');
const path = require('path');

/**
 * Helper function to check if a file exists
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Helper function to create a test HTML file
 * @param {string} content - HTML content
 * @returns {string} - HTML content
 */
function createTestHTML(content = '') {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    ${content}
</body>
</html>
  `.trim();
}

module.exports = {
  fileExists,
  createTestHTML
};