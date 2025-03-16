const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the product display view HTML
* ************************************ */
Util.buildProductDetails = async function(data){
  let details
  if (data.length > 0) {
    details  = '<div class="details">'
    details += '<h1>' + data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model + '</h1>'
    details +=  '<img src="' + data[0].inv_image 
      +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
      +' on CSE Motors" >'
    details += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + ' Details</h2>'

    details += '<div class="info">'
    details += '<div class="price">'
    details += '<h3>Price: </h3>'
    details += '<p>$' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</p>'
    details += '</div>'

    details += '<div class="description">'
    details += '<h3>Description: </h3>'
    details += '<p>' + data[0].inv_description + '</p>'
    details += '</div>'

    details += '<div class="color">'
    details += '<h3>Color: </h3>'
    details += '<p>' + data[0].inv_color + '</p>'
    details += '</div>'

    details += '<div class="miles">'
    details += '<h3>Miles: </h3>'
    details += '<p>' + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</p>'
    details += '</div>'

    details += '</div>'
    details += '</div>'
  }
  return details
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* **************************************
* Build the classification list display
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

  /* ****************************************
 *  Check Account Type
 * ************************************ */
  Util.checkAccountType = (req, res, next) => {
    let accountType = res.locals.accountData.account_type;
    if (accountType == 'Employee' || accountType == 'Admin') {
      next()
    } else {
      req.flash("notice", "You must be an employee or admin to access that page.")
      return res.redirect("/account/login")
    }
   }

module.exports = Util