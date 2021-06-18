const { verify } = require("jsonwebtoken");
const verifyJWT = require("../utils/verifyJWT.js");

module.exports = app => {
    const product = require("../controllers/product.controller.js");
  
    var router = require("express").Router();

    router.post('/add',product.createNew)
    router.post('/all',product.findAll)
  
    app.use('/api/product', router);
  };