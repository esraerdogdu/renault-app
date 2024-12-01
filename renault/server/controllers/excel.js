const path = require("path");
const XLSX = require("xlsx");
const fs = require("fs");

// Helper function to convert Excel to JSON
const readExcelFile = () => {
  const filePath = path.join(__dirname, "../data/Dataset.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};

// Controller function to convert Excel to JSON
const convertExcelToJson = async (req, res) => {
  try {
    // Convert the Excel file to JSON
    const jsonData = readExcelFile();
    const filePath = path.join(__dirname, '../data/output.json');

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to write JSON file",
        });
      }
    });
  } catch (error) {
    console.error("Error reading Excel file:", error);

    // Send an error response
    res.status(500).json({
      success: false,
      message: "Failed to convert Excel file to JSON",
    });
  }
};

module.exports = {
  convertExcelToJson,
};
