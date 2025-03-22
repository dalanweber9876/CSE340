const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
        }
    }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
    // valid email is required and cannot already exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists){
            throw new Error("Email not found. Please register first.")
        }
    }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
  }
  
  /***********************************
  *  Edit Account Data Validation Rules
  * **********************************/
validate.editAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          const account = await accountModel.getAccountByEmail(account_email)
          if (account.account_id != req.body.account_id) {
            throw new Error("Email exists. Please log in or use different email")
          } 
        }
    }),
  ]
}

/* ******************************
* Check data and return errors or continue to Edit Account
* ***************************** */
validate.checkEditData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/updateAccount", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/***********************************
  *  Change Password Data Validation Rules
  * **********************************/
validate.changePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
* Check data and return errors or continue to Edit Account
* ***************************** */
validate.checkNewPassword = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  console.log(account_firstname + "\n" + account_lastname + "\n" + account_email)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/updateAccount", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
    })
    return
  }
  next()
}

  module.exports = validate