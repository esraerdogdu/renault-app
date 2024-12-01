const fs = require("fs");
const path = require("path");

const getAllData = async () => {
  try {
    const filePath = path.join(__dirname, "../data/output.json");

    // Read the file asynchronously
    const data = await fs.promises.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.error("Error while fetching data: ", error);
    throw new Error("Failed to fetch data");
  }
};

const getFilteredData = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { pub_sourcetimestamp, pub_objectuai } = req.query;

    // Convert pub_sourcetimestamp to a float (in case it's a string)
    const timestamp = parseFloat(pub_sourcetimestamp);

    // Fetch all data
    const data = await getAllData();

    // Filter the data based on the query parameters
    const filteredData = data.filter((item) => {
      let matchesTimestamp = false;
      let matchesObjectUai = false;

      // Compare pub_sourcetimestamp (allowing a small tolerance due to floating-point precision)
      if (timestamp && Math.abs(item.pub_sourcetimestamp - timestamp) < 1e-6) {
        matchesTimestamp = true;
      }

      // Compare pub_objectuai (ensure it's a string comparison)
      if (pub_objectuai && item.pub_objectuai === pub_objectuai) {
        matchesObjectUai = true;
      }

      // Only return the item if both conditions are met
      return matchesTimestamp && matchesObjectUai;
    });

    // If no data matches, return an appropriate message
    if (filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found matching the provided filters.",
      });
    }

    // Respond with the filtered data as a whole
    return res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error while fetching filtered data: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch filtered data",
    });
  }
};

module.exports = {
  getAllData,
  getFilteredData, // Export getFilteredData as well
};
