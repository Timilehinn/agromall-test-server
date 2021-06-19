const { verify } = require("jsonwebtoken");
const verifyJWT = require("../utils/verifyJWT.js");

module.exports = app => {
    const market = require("../controllers/market.controller.js");
  
    var router = require("express").Router();

    router.post('/add',market.createNew)
    router.get('/all',market.all)
  
    app.use('/api/market', router);
  };