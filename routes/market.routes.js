const { verify } = require("jsonwebtoken");
const verifyJWT = require("../utils/verifyJWT.js");

module.exports = app => {
    const market = require("../controllers/market.controller.js");
  
    var router = require("express").Router();

    router.post('/add',verifyJWT,market.createNew)
    router.post('/update',verifyJWT,market.update)
    router.post('/delete',verifyJWT,market.delete)
    router.get('/all',market.all)
    router.get('/one',market.one)
    router.get('/search',market.search)
    router.post('/sync-searchengine',verifyJWT,market.sync)
  
    app.use('/api/market', router);
  };