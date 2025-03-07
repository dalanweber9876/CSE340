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

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", 
    validateManagement.classificationRules(), 
    validateManagement.checkClassificationName,
    utilities.handleErrors(invController.addClassification));

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", 
    validateManagement.inventoryRules(), 
    validateManagement.checkInventory,
    utilities.handleErrors(invController.addInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Routes to edit inventory
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventory))
router.post("/update/", validateManagement.inventoryRules(), validateManagement.checkUpdateData, utilities.handleErrors(invController.updateInventory))

module.exports = router;