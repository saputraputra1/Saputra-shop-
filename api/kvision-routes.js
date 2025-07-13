const express = require("express");
const router = express.Router();
const kvision = require("./kvision");

router.get("/kvision/orders", kvision.getOrders);
router.post("/kvision/order", kvision.upload.single("bukti"), kvision.newOrder);
router.post("/kvision/status", kvision.updateStatus);

module.exports = router;