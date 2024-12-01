const express = require("express");
const router = express.Router();
const controller = require("../controllers/data");

router.get("/getAllData", controller.getAllData);
router.get("/getFilteredData", controller.getFilteredData);

module.exports = router;
