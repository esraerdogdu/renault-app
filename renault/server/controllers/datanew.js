const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Function to fetch all data from the JSON file
const getAllData = async () => {
  try {
    const filePath = path.join(__dirname, "../data/output.json");
    
    // Read file asynchronously 
    const data = await fs.promises.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.error("Error while fetching data: ", error);
    throw new Error("Failed to fetch data");
  }
};

// Filter by time range
app.get("/filter_by_time", async (req, res) => {
  try {
    const { start_time, end_time } = req.query;
    if (!start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "start_time and end_time are required",
      });
    }

    const data = await getAllData();
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    const filteredData = data.filter((item) => {
      const timestamp = new Date(item.pub_sourcetimestamp);
      return timestamp >= startTime && timestamp <= endTime;
    });

    if (filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found matching the provided time range.",
      });
    }

    res.status(200).json({ success: true, data: filteredData });
  } catch (error) {
    console.error("Error while filtering by time: ", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Filter by Machine ID
app.get("/filter_by_object", async (req, res) => {
  try {
    const { machine_id } = req.query;
    if (!machine_id) {
      return res.status(400).json({
        success: false,
        message: "machine_id is required",
      });
    }

    const data = await getAllData();
    const filteredData = data.filter(
      (item) => item.pub_objectuai === machine_id
    );

    if (filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the given machine_id.",
      });
    }

    res.status(200).json({ success: true, data: filteredData });
  } catch (error) {
    console.error("Error while filtering by machine: ", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Filter by active power range
app.get("/filter_by_power", async (req, res) => {
  try {
    const { min_power, max_power } = req.query;
    const minPower = parseFloat(min_power);
    const maxPower = parseFloat(max_power);

    if (!min_power && !max_power) {
      return res.status(400).json({
        success: false,
        message: "At least one of min_power or max_power is required",
      });
    }

    const data = await getAllData();
    const filteredData = data.filter((item) => {
      const power = item.ActTotalActivePower;
      if (min_power && max_power) return power >= minPower && power <= maxPower;
      if (min_power) return power >= minPower;
      if (max_power) return power <= maxPower;
    });

    if (filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the given power range.",
      });
    }

    res.status(200).json({ success: true, data: filteredData });
  } catch (error) {
    console.error("Error while filtering by power: ", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = {
  getAllData,
  getFilteredData, // Export getFilteredData as well
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});  