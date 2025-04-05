const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities = require('../utilities')
const messageValidate = require('../utilities/message-validation')

// Inbox
router.get("/", utilities.handleErrors(messageController.buildInbox));

// Single Message View
router.get("/view/:message_id", utilities.handleErrors(messageController.buildSingleMessage));

// Mark as Read
router.put("/mark-read/:message_id", utilities.handleErrors(messageController.toggleRead));

// Archive
router.put("/archive/:message_id", utilities.handleErrors(messageController.toggleArchived));

// New Message
router.get ("/new-message", utilities.handleErrors(messageController.buildNewMessage));
router.post("/new-message", 
    utilities.checkLogin,
    messageValidate.messageRules(), 
    messageValidate.checkMessageData,
    utilities.handleErrors(messageController.sendNewMessage))

// Archive
router.get("/archives", utilities.handleErrors(messageController.buildViewArchive));

module.exports = router;