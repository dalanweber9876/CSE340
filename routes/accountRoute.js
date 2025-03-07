// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')

// Default account management route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
    '/register', 
    regValidate.registationRules(), 
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(), 
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;