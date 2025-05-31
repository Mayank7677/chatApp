const express = require("express");
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/getUsersForSidebar", auth, messageController.getUsersForSidebar);
router.get("/getMessages/:id", auth, messageController.getMessages);
router.put("/markAsSeen/:id", auth, messageController.markMessageAsSeen);
router.post("/sendMessage/:id", auth, messageController.sendMessage);

module.exports = router; 