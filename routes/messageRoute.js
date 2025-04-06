const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities = require('../utilities')
const messageValidate = require('../utilities/message-validation')

// Inbox
router.get("/", utilities.checkLogin, utilities.handleErrors(messageController.buildInbox));

// Single Message View
router.get("/view/:message_id", utilities.checkLogin, utilities.handleErrors(messageController.buildSingleMessage));

// Mark as Read
router.put("/mark-read/:message_id", utilities.checkLogin, utilities.handleErrors(messageController.toggleRead));

// Archive
router.put("/archive/:message_id", utilities.checkLogin, utilities.handleErrors(messageController.toggleArchived));

// Delete
router.delete("/delete/:message_id", utilities.checkLogin, utilities.handleErrors(messageController.deleteMessage));

// New Message
router.get ("/new-message", utilities.checkLogin, utilities.handleErrors(messageController.buildNewMessage));
router.post("/new-message", 
    utilities.checkLogin,
    messageValidate.messageRules(), 
    messageValidate.checkMessageData,
    utilities.handleErrors(messageController.sendNewMessage))

// Reply
router.get("/reply/:message_id", utilities.checkLogin, utilities.handleErrors(messageController.buildReply));
router.post("/reply-message", 
    utilities.checkLogin,
    messageValidate.replyRules(), 
    messageValidate.checkReplyData,
    utilities.handleErrors(messageController.sendReply));

// Archive
router.get("/archives", utilities.checkLogin, utilities.handleErrors(messageController.buildViewArchive));

module.exports = router;