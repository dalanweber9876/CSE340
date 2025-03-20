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

// Edit Account
router.get("/edit/:client_id", utilities.checkLogin, utilities.handleErrors(accountController.buildEditAccount));
router.post(
    "/edit-account/:client_id",
    utilities.checkLogin,
    regValidate.editAccountRules(), 
    regValidate.checkEditData,
    utilities.handleErrors(accountController.updateAccount)
)

// Change Password
router.post(
    "/change-password/:client_id",
    utilities.checkLogin,
    regValidate.changePasswordRules(), 
    regValidate.checkNewPassword,
    utilities.handleErrors(accountController.changePassword)
)

// Logout
router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.logout));

module.exports = router;