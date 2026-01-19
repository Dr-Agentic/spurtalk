const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

// Configuration
const API_URL = "http://localhost:3000/api/documents/upload";
const TEST_FILES_DIR = "./test-files";

// Create test files directory if it doesn't exist
if (!fs.existsSync(TEST_FILES_DIR)) {
  fs.mkdirSync(TEST_FILES_DIR);
}

// Create test files
const testFiles = [
  {
    name: "test.pdf",
    content:
      "PDF test content with some tasks:\n1. Complete project by December 15\n2. Review documentation\n3. Test all features",
  },
  {
    name: "test.txt",
    content:
      "Text file with tasks:\n- Write blog post about new features\n- Update README with installation instructions\n- Create tutorial video",
  },
  {
    name: "test.md",
    content:
      "# Test Markdown File\n\n## Tasks\n- [ ] Implement user authentication\n- [ ] Create database schema\n- [ ] Write API documentation\n\n## Deadlines\n- Authentication: 2024-12-01\n- Database: 2024-12-05\n- Documentation: 2024-12-10",
  },
];

// Create test files
testFiles.forEach((file) => {
  const filePath = path.join(TEST_FILES_DIR, file.name);
  fs.writeFileSync(filePath, file.content);
  console.log(`Created test file: ${filePath}`);
});

// Test document upload
async function testDocumentUpload() {
  try {
    console.log("\n=== Testing Document Processing ===");

    for (const file of testFiles) {
      const filePath = path.join(TEST_FILES_DIR, file.name);
      const formData = new FormData();
      formData.append("document", fs.createReadStream(filePath));

      console.log(`\nTesting upload of: ${file.name}`);

      const response = await axios.post(API_URL, formData, {
        headers: {
          ...formData.getHeaders(),
          // Add auth header if needed
          // 'Authorization': 'Bearer YOUR_TOKEN'
        },
        maxBodyLength: Infinity,
      });

      console.log(`✅ Success: ${file.name}`);
      console.log(`Extracted ${response.data.tasks.length} tasks`);
      console.log(`Confidence: ${response.data.confidence}`);
      console.log("Tasks:");
      response.data.tasks.forEach((task, index) => {
        console.log(
          `  ${index + 1}. ${task.title} (confidence: ${task.confidence})`
        );
      });
    }

    console.log("\n=== All Tests Completed ===");

    // Clean up test files
    testFiles.forEach((file) => {
      const filePath = path.join(TEST_FILES_DIR, file.name);
      fs.unlinkSync(filePath);
    });
    fs.rmdirSync(TEST_FILES_DIR);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

// Run tests
testDocumentUpload();
