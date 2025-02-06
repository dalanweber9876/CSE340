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
  })
}

module.exports = invCont