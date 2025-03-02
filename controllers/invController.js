const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ********************************************
 *  Build inventory by classification view
 * *******************************************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ********************************************
 *  Build product details view
 * *******************************************/
invCont.buildDetailsByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInfoByInvId(inv_id)
  const details = await utilities.buildProductDetails(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/details", {
    title: vehicleName + " Details",
    nav,
    details,
    errors: null,
  })
}

/* ********************************************
 *  Build management view
 * *******************************************/
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const noticeMessage = req.flash('notice');
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ********************************************
 *  Build Add Classification view
 * *******************************************/
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ********************************************
 *  Add Classification
 * *******************************************/
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(
    classification_name
  )
  let nav = await utilities.getNav()

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you succesfully added a new classification!`
    )
    return res.redirect('/inv')
  } else {
    req.flash("notice", "Sorry, the new classification was not created. Please try again!")
    return res.redirect('/inv/add-classification');
  }
}

/* ********************************************
 *  Build Add Inventory view
 * *******************************************/
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    classificationList: classificationList
  })
}

/* ********************************************
 *  Add Inventory
 * *******************************************/
invCont.addInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const addResult = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )
  let nav = await utilities.getNav()

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you succesfully added a new inventory!`
    )
    return res.redirect('/inv')
  } else {
    req.flash("notice", "Sorry, the new inventory was not created. Please try again!")
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: req.validationErrors(),
      classificationList: classificationList,
      locals: req.body,
      classification_id: req.body.classification_id
    });
  }
}

module.exports = invCont