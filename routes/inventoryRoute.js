// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const validateManagement = require('../utilities/management-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build product details view
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailsByInvId));

router.get("/", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", 
    utilities.checkJWTToken,
    utilities.checkAccountType, 
    validateManagement.classificationRules(), 
    validateManagement.checkClassificationName,
    utilities.handleErrors(invController.addClassification));

router.get("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", 
    utilities.checkJWTToken,
    utilities.checkAccountType,
    validateManagement.inventoryRules(), 
    validateManagement.checkInventory,
    utilities.handleErrors(invController.addInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Routes to edit inventory
router.get("/edit/:inventory_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory))
router.post("/update/", utilities.checkJWTToken, utilities.checkAccountType, validateManagement.inventoryRules(), validateManagement.checkUpdateData, utilities.handleErrors(invController.updateInventory))

// Routes to delete inventory
router.get("/delete/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteConfirmation))
router.post("/delete/", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))

module.exports = router;