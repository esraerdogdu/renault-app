const express = require("express")
const router = express.Router()
const controller = require("../controllers/excel")

router.get("/convertExcelToJson", controller.convertExcelToJson)

module.exports = router