const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required, must be alphanumeric, and trimmed
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage("Please provide a name without spaces or special characters."),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationName = async (req, res, next) => {
    
  // Get validation errors from the request
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    
    return res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add New Classification",
      nav,
      classification_name: req.body.classification_name,
    })
  }

  // If validation passes, proceed to the next middleware
  next()
}


/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The make is required.")
      .isString()
      .withMessage("The make must be a valid string."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The model is required.")
      .isString()
      .withMessage("The model must be a valid string."),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The year is required.")
      .isInt({ min: 1000, max: 9999 })
      .withMessage("The year must be a valid integer between 1000 and 9999."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The description is required.")
      .isString()
      .withMessage("The description must be a valid string."),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The image path is required.")
      .isString()
      .withMessage("The image path must be a valid string."),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The thumbnail path is required.")
      .isString()
      .withMessage("The thumbnail path must be a valid string."),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The price is required.")
      .isFloat({ min: 0, max: 999999999, decimal_digits: 2 })
      .withMessage("The price must be a valid decimal number with up to two decimal places."),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The miles are required.")
      .isInt()
      .withMessage("The miles must be a valid integer."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The color is required.")
      .isString()
      .withMessage("The color must be a valid string."),

    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Selection of a classification is required.")
      .isInt()
      .withMessage("The classification ID must be a valid integer."),

  ]
}


/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkInventory = async (req, res, next) => {
    
  // Get validation errors from the request
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    
    return res.render("inventory/add-inventory", {
      errors: errors,
      title: "Add New Inventory",
      nav,
      classificationList: classificationList,
      locals: req.body,
    })
  }

  // If validation passes, proceed to the next middleware
  next()
}

module.exports = validate
