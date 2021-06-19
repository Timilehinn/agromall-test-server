const { verify } = require("jsonwebtoken");
const verifyJWT = require("../utils/verifyJWT.js");

module.exports = app => {
    const market = require("../controllers/market.controller.js");
  
    var router = require("express").Router();

    router.post('/add',market.createNew)
    router.post('/update',market.update)
    router.get('/all',market.all)
    router.get('/one',market.one)
  
    app.use('/api/market', router);
  };