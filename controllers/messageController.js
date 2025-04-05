const messageModel = require("../models/message-model")
const utilities = require("../utilities/")

/* ****************************************
*  Deliver inbox view
* *************************************** */
async function buildInbox(req, res, next) {
    let nav = await utilities.getNav()
    // Retrieve messages and pass them into buildMessagesTable()
    let data = await messageModel.getMessagesByAccountId(res.locals.accountData.account_id)
    let messageTable = await utilities.buildMessagesTable(data);
    const account_firstname = res.locals.accountData.account_firstname;
    const account_lastname = res.locals.accountData.account_lastname;
    const name = account_firstname + " " + account_lastname;
    res.render("message/inbox", {
      title: name + "'s Inbox",
      nav,
      errors: null,
      name: name,
      messageTable: messageTable,
    })
}

/* ****************************************
*  Deliver new message view
* *************************************** */
async function buildNewMessage(req, res, next) {
    let nav = await utilities.getNav()
    let contactSelection = await utilities.buildMessageList();
    res.render("message/newMessage", {
      title: "New Message",
      nav,
      errors: null,
      contactSelection: contactSelection
    })
}

/* ****************************************
*  Deliver archive view
* *************************************** */
async function buildViewArchive(req, res, next) {
    let nav = await utilities.getNav()
    res.render("message/archives", {
      title: "Archives",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Send a new message
* *************************************** */
async function sendNewMessage(req, res, next) {
  const { message_to, message_subject, message_body, account_id } = req.body
  console.log(req.body);

  const addResult = await messageModel.addNewMessage(
    message_to, message_subject, message_body, account_id
  )
  let nav = await utilities.getNav()

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you sent a new message!`
    )
    return res.redirect('/inbox')
  } else {
    req.flash("notice", "Sorry, the new message was not sent. Please try again!")
    res.render("./message/newMessage", {
      title: "Send New Message",
      nav,
      errors: req.validationErrors(),
      locals: req.body,
    });
  }
}

/* ****************************************
*  Deliver single message view
* *************************************** */
async function buildSingleMessage(req, res, next) {
  let nav = await utilities.getNav()
  let message_id = parseInt(req.params.message_id);
  let message = await messageModel.getSingleMessage(message_id)
  res.render("message/singleMessage", {
    title: message.message_subject,
    nav,
    errors: null,
    message,
  })
}

/* ****************************************
*  Mark a message as read
* *************************************** */
async function toggleRead(req, res, next) {
  let message_id = parseInt(req.params.message_id);

  const updateResult = await messageModel.toggleRead(message_id)
  let nav = await utilities.getNav()

  if (updateResult) {
    req.flash(
      "notice",
      `Read status successfully toggled`
    )
    return res.redirect('/inbox')
  } else {
    req.flash("notice", "Sorry, the update could not be made. Please try again!")
    res.render("/inbox", {
      title: "Inbox",
      nav,
      errors: req.validationErrors(),
      locals: req.body,
    });
  }
}

/* ****************************************
*  Mark a message as archived
* *************************************** */
async function toggleArchived(req, res, next) {
  let message_id = parseInt(req.params.message_id);

  const updateResult = await messageModel.toggleArchived(message_id)
  let nav = await utilities.getNav()

  if (updateResult) {
    req.flash(
      "notice",
      `Archive status successfully toggled`
    )
    return res.redirect('/inbox')
  } else {
    req.flash("notice", "Sorry, the update could not be made. Please try again!")
    res.render("/inbox", {
      title: "Inbox",
      nav,
      errors: req.validationErrors(),
      locals: req.body,
    });
  }
}

module.exports = { buildInbox, buildNewMessage, buildViewArchive, sendNewMessage, buildSingleMessage, toggleRead, toggleArchived }