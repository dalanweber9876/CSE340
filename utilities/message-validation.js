const { body, validationResult } = require("express-validator")
const validate = {}
const utilities = require('../utilities')
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")

/* **********************************
  *  New Message Validation Rules
  * ********************************* */
validate.messageRules = () => {
    return [
      // firstname is required and must be string
      body("message_to")
        .notEmpty()
        .withMessage("Please select a recipient."), // on error this message is sent.
  
      // lastname is required and must be string
      body("message_subject")
        .trim()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide subject"), // on error this message is sent.
  
      // password is required and must be strong password
      body("message_body")
        .trim()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a body"), // on error this message is sent.
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkMessageData = async (req, res, next) => {
    const { message_to, message_subject, message_body } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let contactSelection = await utilities.buildMessageList();
      res.render("message/newMessage", {
        errors,
        title: "Send New Message",
        nav,
        message_to, 
        message_subject, 
        message_body,
        contactSelection,
      })
      return
    }
    next()
}

/* **********************************
  *  Message Reply Validation Rules
  * ********************************* */
validate.replyRules = () => {
  return [
    // password is required and must be strong password
    body("reply_body")
      .trim()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a body"), // on error this message is sent.
  ]
}

/* ******************************
* Check data and return errors
* ***************************** */
validate.checkReplyData = async (req, res, next) => {
  const { reply_to, reply_subject, reply_body, account_id } = req.body
  const message = {message_from: reply_to, message_subject: reply_subject, message_body: reply_body}
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(req.body)
      let nav = await utilities.getNav()
      let contactSelection = await utilities.buildMessageList();
      let account = await accountModel.getAccountById(parseInt(req.body.account_id))
      let name = `${account.account_firstname} ${account.account_lastname}`
      res.render("message/reply", {
        errors,
        title: "Reply",
        nav,
        contactSelection,
        name,
        message,
      })
      return
    }
    next()
}

module.exports = validate